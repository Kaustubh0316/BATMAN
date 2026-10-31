#import <Foundation/Foundation.h>
#import <CoreImage/CoreImage.h>
#import <AppKit/AppKit.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSString *inPath = @"/Users/kaustubhchamankar/BATMAN/public/skyline.jpg";
        NSString *outPath = @"/Users/kaustubhchamankar/BATMAN/public/skyline-hd.jpg";

        CIImage *img = [CIImage imageWithContentsOfURL:[NSURL fileURLWithPath:inPath]];
        if (!img) {
            NSLog(@"Failed to load skyline image");
            return 1;
        }

        CIContext *ctx = [CIContext contextWithOptions:@{ kCIContextHighQualityDownsample: @YES }];

        // 2.5x Lanczos upscale
        CIFilter *lanczos = [CIFilter filterWithName:@"CILanczosScaleTransform"];
        [lanczos setValue:img forKey:kCIInputImageKey];
        [lanczos setValue:@2.5 forKey:kCIInputScaleKey];
        [lanczos setValue:@1.0 forKey:kCIInputAspectRatioKey];
        CIImage *scaled = lanczos.outputImage;

        // Enhance clarity, contrast & glowing lights in buildings
        CIFilter *cc = [CIFilter filterWithName:@"CIColorControls"];
        [cc setValue:scaled forKey:kCIInputImageKey];
        [cc setValue:@1.08 forKey:kCIInputContrastKey];
        [cc setValue:@1.05 forKey:kCIInputSaturationKey];
        CIImage *graded = cc.outputImage;

        CIFilter *unsharp = [CIFilter filterWithName:@"CIUnsharpMask"];
        [unsharp setValue:graded forKey:kCIInputImageKey];
        [unsharp setValue:@1.5 forKey:kCIInputRadiusKey];
        [unsharp setValue:@0.45 forKey:kCIInputIntensityKey];
        CIImage *sharp = unsharp.outputImage;

        CGColorSpaceRef cs = CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
        [ctx writeJPEGRepresentationOfImage:sharp toURL:[NSURL fileURLWithPath:outPath] colorSpace:cs options:@{(id)kCGImageDestinationLossyCompressionQuality: @0.95} error:nil];
        CGColorSpaceRelease(cs);
        NSLog(@"Saved HD skyline to %@", outPath);
    }
    return 0;
}

