#import <Foundation/Foundation.h>
#import <Vision/Vision.h>
#import <CoreImage/CoreImage.h>
#import <AppKit/AppKit.h>
#import <math.h>

static inline float clampf(float v, float lo, float hi) {
    return v < lo ? lo : (v > hi ? hi : v);
}

static inline float smoothstepf(float e0, float e1, float x) {
    float t = clampf((x - e0) / (e1 - e0), 0.0f, 1.0f);
    return t * t * (3.0f - 2.0f * t);
}

static void savePNG(CIContext *ctx, CIImage *img, NSString *path) {
    CGColorSpaceRef cs = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
    NSURL *url = [NSURL fileURLWithPath:path];
    NSError *err = nil;
    [ctx writePNGRepresentationOfImage:img toURL:url format:kCIFormatRGBA8 colorSpace:cs options:@{} error:&err];
    CGColorSpaceRelease(cs);
    if (err) {
        NSLog(@"Error saving %@: %@", path, err);
    } else {
        NSLog(@"Saved %@", path);
    }
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *inputPath = @"/Users/kaustubhchamankar/.gemini/antigravity/brain/91994943-8fec-4d55-b194-17514ca8966f/.user_uploaded/media_1793434867385_251a0a57.jpg";
        NSString *scratchDir = @"/Users/kaustubhchamankar/.gemini/antigravity/brain/91994943-8fec-4d55-b194-17514ca8966f/scratch";
        NSString *publicOutPath = @"/Users/kaustubhchamankar/BATMAN/public/hero-portrait.png";

        CIImage *ciOrig = [CIImage imageWithContentsOfURL:[NSURL fileURLWithPath:inputPath]];
        if (!ciOrig) {
            NSLog(@"Failed to load input image");
            return 1;
        }

        int W = (int)ciOrig.extent.size.width;   // 717
        int H = (int)ciOrig.extent.size.height;  // 1024
        CGRect extent = CGRectMake(0, 0, W, H);

        CIContext *ctx = [CIContext contextWithOptions:@{
            kCIContextHighQualityDownsample: @YES
        }];
        CGColorSpaceRef srgb = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);

        // 1. Run Vision foreground instance segmentation
        VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCIImage:ciOrig options:@{}];
        VNGenerateForegroundInstanceMaskRequest *fgReq = [[VNGenerateForegroundInstanceMaskRequest alloc] init];
        NSError *err = nil;
        [handler performRequests:@[fgReq] error:&err];
        if (err) {
            NSLog(@"Vision error: %@", err);
            return 1;
        }

        VNInstanceMaskObservation *fgObs = fgReq.results.firstObject;
        CVPixelBufferRef fgBuf = [fgObs generateScaledMaskForImageForInstances:fgObs.allInstances fromRequestHandler:handler error:&err];
        CIImage *fgMaskCI = [[CIImage imageWithCVPixelBuffer:fgBuf] imageByCroppingToRect:extent];

        // 2. High-end Photographic Color-Grade & Lighting Enhancement:
        // We want the phone, stickers, face, hands, curls, and jewelry to be super clear, crisp,
        // with rich contrast and a refined platinum-editorial studio feel.
        CIImage *graded = ciOrig;

        // 2a. Gentle noise reduction for low-light JPEG grain
        CIFilter *denoise = [CIFilter filterWithName:@"CINoiseReduction"];
        [denoise setValue:graded forKey:kCIInputImageKey];
        [denoise setValue:@0.015 forKey:@"inputNoiseLevel"];
        [denoise setValue:@0.50 forKey:@"inputSharpness"];
        graded = [denoise.outputImage imageByCroppingToRect:extent];

        // 2b. Lift shadows to reveal face, phone case stickers, camera lenses, bracelet, and hands clearly
        CIFilter *hlSh = [CIFilter filterWithName:@"CIHighlightShadowAdjust"];
        [hlSh setValue:graded forKey:kCIInputImageKey];
        [hlSh setValue:@0.65 forKey:@"inputShadowAmount"];       // lift dark shadows
        [hlSh setValue:@0.85 forKey:@"inputHighlightAmount"];    // preserve highlights on shoulder
        [hlSh setValue:@24.0 forKey:@"inputRadius"];
        graded = [hlSh.outputImage imageByCroppingToRect:extent];

        // 2c. Tone balance: neutralize yellow-olive indoor wall cast to a clean, modern editorial look
        CIFilter *tempTint = [CIFilter filterWithName:@"CITemperatureAndTint"];
        [tempTint setValue:graded forKey:kCIInputImageKey];
        [tempTint setValue:[CIVector vectorWithX:6500 Y:0] forKey:@"inputNeutral"];
        [tempTint setValue:[CIVector vectorWithX:5600 Y:-6] forKey:@"inputTargetNeutral"];
        graded = [tempTint.outputImage imageByCroppingToRect:extent];

        // 2d. Editorial contrast & richness
        CIFilter *colCtrl = [CIFilter filterWithName:@"CIColorControls"];
        [colCtrl setValue:graded forKey:kCIInputImageKey];
        [colCtrl setValue:@1.08 forKey:kCIInputContrastKey];
        [colCtrl setValue:@0.92 forKey:kCIInputSaturationKey];
        [colCtrl setValue:@0.03 forKey:kCIInputBrightnessKey];
        graded = [colCtrl.outputImage imageByCroppingToRect:extent];

        // 2e. Subtle luminance sharpening to make phone camera lenses, bracelet gleam, and curls razor-sharp
        CIFilter *sharpen = [CIFilter filterWithName:@"CISharpenLuminance"];
        [sharpen setValue:graded forKey:kCIInputImageKey];
        [sharpen setValue:@0.55 forKey:kCIInputSharpnessKey];
        graded = [sharpen.outputImage imageByCroppingToRect:extent];

        // 3. Render into buffers for pixel-level edge blending and soft vignette
        size_t rowBytes = W * 4;
        uint8_t *gradBuf = (uint8_t *)calloc(H * rowBytes, 1);
        uint8_t *fgBytes = (uint8_t *)calloc(H * rowBytes, 1);
        uint8_t *outBuf = (uint8_t *)calloc(H * rowBytes, 1);

        [ctx render:graded toBitmap:gradBuf rowBytes:rowBytes bounds:extent format:kCIFormatRGBA8 colorSpace:srgb];
        [ctx render:fgMaskCI toBitmap:fgBytes rowBytes:rowBytes bounds:extent format:kCIFormatRGBA8 colorSpace:srgb];
        CVBufferRelease(fgBuf);

        for (int y = 0; y < H; y++) {
            // Smooth bottom fade into deep dark hero background (#07080a) starting around y = 920
            float bottomFade = 1.0f;
            if (y > 900) {
                bottomFade = 1.0f - smoothstepf(900.0f, 1020.0f, (float)y);
            }

            for (int x = 0; x < W; x++) {
                size_t p = (y * W + x) * 4;
                float rawAlpha = fgBytes[p] / 255.0f;

                // Soft left-edge feather where the original photo touched x = 0 (shoulder & forearm)
                // so there is NO harsh cut line against the dark background!
                float leftEdgeFeather = 1.0f;
                if (x < 36 && (y > 450 || y > 850)) {
                    leftEdgeFeather = smoothstepf(0.0f, 32.0f, (float)x);
                }

                // Soft right-edge feather on extreme lower-right forearm
                float rightEdgeFeather = 1.0f;
                if (x > W - 30 && y > 820) {
                    rightEdgeFeather = smoothstepf((float)(W - 1), (float)(W - 30), (float)x);
                }

                float finalAlpha = rawAlpha * bottomFade * leftEdgeFeather * rightEdgeFeather;

                if (finalAlpha <= 0.002f) {
                    outBuf[p + 0] = 0;
                    outBuf[p + 1] = 0;
                    outBuf[p + 2] = 0;
                    outBuf[p + 3] = 0;
                    continue;
                }

                float r = gradBuf[p + 0];
                float g = gradBuf[p + 1];
                float b = gradBuf[p + 2];

                // Premultiply for CoreImage RGBA8 output
                outBuf[p + 0] = (uint8_t)clampf(r * finalAlpha, 0.0f, 255.0f);
                outBuf[p + 1] = (uint8_t)clampf(g * finalAlpha, 0.0f, 255.0f);
                outBuf[p + 2] = (uint8_t)clampf(b * finalAlpha, 0.0f, 255.0f);
                outBuf[p + 3] = (uint8_t)clampf(finalAlpha * 255.0f, 0.0f, 255.0f);
            }
        }

        NSData *data = [NSData dataWithBytesNoCopy:outBuf length:H * rowBytes freeWhenDone:NO];
        CIImage *processedCI = [CIImage imageWithBitmapData:data bytesPerRow:rowBytes size:CGSizeMake(W, H) format:kCIFormatRGBA8 colorSpace:srgb];

        // 2x Retina Lanczos scaling + gentle unsharp mask for crystal-clear 1434x2048 presentation
        CIFilter *lanczos = [CIFilter filterWithName:@"CILanczosScaleTransform"];
        [lanczos setValue:processedCI forKey:kCIInputImageKey];
        [lanczos setValue:@1.5 forKey:kCIInputScaleKey];
        [lanczos setValue:@1.0 forKey:kCIInputAspectRatioKey];
        CIImage *hiRes = lanczos.outputImage;

        CIFilter *unsharp = [CIFilter filterWithName:@"CIUnsharpMask"];
        [unsharp setValue:hiRes forKey:kCIInputImageKey];
        [unsharp setValue:@1.2 forKey:kCIInputRadiusKey];
        [unsharp setValue:@0.35 forKey:kCIInputIntensityKey];
        hiRes = [unsharp.outputImage imageByCroppingToRect:hiRes.extent];

        savePNG(ctx, hiRes, publicOutPath);

        // Preview composite on a dark slate background to check clarity
        CGRect previewRect = hiRes.extent;
        CIImage *bgDark = [[CIImage imageWithColor:[CIColor colorWithRed:0.04 green:0.045 blue:0.055 alpha:1.0]] imageByCroppingToRect:previewRect];
        CIImage *comp = [hiRes imageByCompositingOverImage:bgDark];
        savePNG(ctx, comp, [scratchDir stringByAppendingPathComponent:@"preview_clean_hero.png"]);

        CGColorSpaceRelease(srgb);
        free(gradBuf);
        free(fgBytes);
        free(outBuf);
        NSLog(@"Hero portrait processed successfully!");
    }
    return 0;
}

