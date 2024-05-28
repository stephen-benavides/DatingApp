using CloudinaryDotNet.Actions;

namespace API.Helpers.IPhotoService;

public interface IPhotoService
{
    public Task<ImageUploadResult> AddPhotoAsync(IFormFile file);
    public Task<DeletionResult> DeletePhotoAsync(string publicId);
}

/*
    STUDY NOTES - CLOUDINARY (2)

    1. Interface with the methods we are going to be using from cloudinary to handle our files 
    2. ImageUploadResult and DelationResult both use the CloudinaryDotNet.Actions import. 
    3. The IFromFile contains all the parameters that our image is going to have 
        1. It returns an ImageUploadResult with containts a publicId which is stored in the DB
    4. With the publicId we can delete the photo from the cloudinary services. 
        
    5. IFormFile -
        1. It belongs to asp.net core libraries 
        2. Indicates that a file is being transfered using an http request
*/