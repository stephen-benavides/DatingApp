using API.Helpers;
using API.Helpers.IPhotoService;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;
public class PhotoService : IPhotoService
{
    //Cloudinary Account Property 
    public readonly Cloudinary _cloudinary;
    //Injecting the cludinary instance (helper) that was mapped for the configuration usage in the ApplicationServicesExtension.cs
    public PhotoService(IOptions<CloduinarySettings> config)
    {
        //initializing the cloudinary account property with our configuration model (notes below)
        var acc = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(acc);

    }
    public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file)
    {
        //Element that we are returning 
        var uploadResult = new ImageUploadResult();
        
        //check if the file has elements, if so, it means there are pictures being passed from client to server 
        if(file.Length > 0){
            //Access stream of the file to upload the stream to cloudinary 
                //stream consumes memory, need to dispose of (using keyword)
            using var stream = file.OpenReadStream();
            //ImageUploadParams comes from cloudinary
            var uploadParams = new ImageUploadParams{
                //It has the actual file to be passed to cloudinary
                File = new FileDescription(file.FileName, stream),
                //Sets how the image is going to be stored as in cloudinary, such as emphasis on the face
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                //Specify the folder where the images are going to in the cloudinary site 
                Folder = "datingApp-dot7"
            };

            //Upload the image to cloudinary with the above parameters
            uploadResult = await _cloudinary.UploadAsync(uploadParams);
        }

        return uploadResult;
    }

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        //From cloudinary, based on the public id, delete the image
        var deleteParams = new DeletionParams(publicId);
        //returns a deletion result
        return await _cloudinary.DestroyAsync(deleteParams);
    }
}

/*
    STUDY NOTES - CLOUDINARY (3)

        1. Implementation of the cloudinary interface 
        2. We are injecting the config file (appsettings.json) that contains our cloudinary information  
            1. This was configured on: 
                ApplicationSevicesExtnsions > STUDY NOTES - Configuration 
            2. Go to the notes on the above to know more about the mapping to config 
            3. This is the model that is used to map between our config file and the cloudinary settings
                1. We mapped the entire json key and value through the program.cs (LN 1 on this paragraph)

        3. In ApplicationServicesExtensions.cs, adding a new dependency injection to map this service implementation with our
            interface IPhotoService 
            1. services.AddScoped<IPhotoService, PhotoService>();
            2. Now we can inject our interface into the other clases 
*/
