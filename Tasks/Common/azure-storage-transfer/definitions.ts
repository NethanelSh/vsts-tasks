export interface IBlobTransferService {
    // source: local folder
    // destination: storage container
    uploadBlobs(source: string, destUrl: string, accessKey: string);
}