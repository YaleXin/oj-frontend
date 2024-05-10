/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_List_string_ } from '../models/BaseResponse_List_string_';
import type { ExecuteCodeRequest } from '../models/ExecuteCodeRequest';
import type { ExecuteCodeResponse } from '../models/ExecuteCodeResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SandboxControllerService {
    /**
     * executeCode
     * @param executeCodeRequest executeCodeRequest
     * @returns ExecuteCodeResponse OK
     * @returns any Created
     * @throws ApiError
     */
    public static executeCodeUsingPost(
        executeCodeRequest: ExecuteCodeRequest,
    ): CancelablePromise<ExecuteCodeResponse | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sandbox/executeCode',
            body: executeCodeRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getLanguages
     * @returns BaseResponse_List_string_ OK
     * @throws ApiError
     */
    public static getLanguagesUsingGet(): CancelablePromise<BaseResponse_List_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sandbox/languages',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
