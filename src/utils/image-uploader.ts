import { PipeTransform } from '@nestjs/common/interfaces';
import * as AWS from 'aws-sdk';
const s3 = new AWS.S3({
  endpoint: 'https://s3.filebase.com',
  signatureVersion: 'v4',
});

export function Upload(name) {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: name,
    ContentType: 'image/png',
  };
  const request = s3.putObject(params, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(
        'Successfully uploaded file' + name + ':' + process.env.BUCKET_NAME,
      );
    }
  });
  request.on('httpHeaders', (statusCode, headers) => {
    console.log(`CID:${headers['x-amz-meta-cid']}`);
    console.log(
      `Go to https://ipfs.filebase.io/ipfs/${headers['x-amz-meta-cid']}`,
    );
  });
}

export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const sizeLimit5mb = 5000000;
    return value.size < sizeLimit5mb;
  }
}

export abstract class FileValidator<TValidationOptions = Record<string, any>> {
  constructor(protected readonly validationOptions: TValidationOptions) {}
  abstract isValid(file?: any): boolean | Promise<boolean>;
  abstract buildErrorMessage(file: any): string;
}
