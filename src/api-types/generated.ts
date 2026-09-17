/**
 * GENERATED FILE — do not edit by hand.
 * Produced by `pnpm gen:api` from src/api-types/openapi.json.
 * Fix the API contract instead.
 */

export interface paths {
    "/audit-logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuditController_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["HealthController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup/studio": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_signupStudio"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup/player": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_signupPlayer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/signup/availability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuthController_checkAvailability"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_refresh"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AuthController_me"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password/forgot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["AuthController_resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orgs/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OrgsController_current"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orgs/members": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["OrgsController_members"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orgs/members/invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["OrgsController_invite"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/orgs/members/{userId}/role": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["OrgsController_changeRole"];
        trace?: never;
    };
    "/orgs/members/{userId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: operations["OrgsController_updateStatus"];
        trace?: never;
    };
    "/orgs/members/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["OrgsController_remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamesController_list"];
        put?: never;
        post: operations["GamesController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamesController_get"];
        put?: never;
        post?: never;
        delete: operations["GamesController_remove"];
        options?: never;
        head?: never;
        patch: operations["GamesController_update"];
        trace?: never;
    };
    "/games/{id}/assets/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["GamesController_createAssetUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}/assets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["GamesController_confirmAsset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}/assets/{assetId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete: operations["GamesController_removeAsset"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/recordings/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MediaController_createUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/recordings/complete": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["MediaController_complete"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/recordings/{recordingId}/playback-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["MediaController_playbackUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AuditLogListDto_Output: {
            data: {
                id: string;
                organizationId: string | null;
                actorUserId: string | null;
                action: string;
                entity: string;
                entityId: string | null;
                before: {
                    [key: string]: unknown;
                } | null;
                after: {
                    [key: string]: unknown;
                } | null;
                ip: string | null;
                requestId: string | null;
                createdAt: string;
            }[];
            nextCursor: string[];
        };
        LoginDto: {
            /** Format: email */
            email: string;
            password: string;
        };
        LoginResponseDto_Output: {
            accessToken: string;
            user: {
                id: string;
                email: string;
                displayName: string;
                organizationId: string;
                /** @enum {string} */
                role: "owner" | "admin" | "studio" | "player";
            };
        };
        SignupStudioDto: {
            displayName: string;
            /** Format: email */
            email: string;
            password: string;
            /** Format: date */
            birthdate: string;
            organizationName: string;
            acceptedTerms?: boolean;
        };
        SignupPlayerDto: {
            displayName: string;
            /** Format: email */
            email: string;
            password: string;
            /** Format: date */
            birthdate: string;
            acceptedTerms?: boolean;
        };
        SignupAvailabilityDto_Output: {
            available: boolean;
        };
        MessageResponseDto_Output: {
            message: string;
        };
        AuthUserDto_Output: {
            id: string;
            email: string;
            displayName: string;
            organizationId: string;
            /** @enum {string} */
            role: "owner" | "admin" | "studio" | "player";
        };
        ForgotPasswordDto: {
            /** Format: email */
            email: string;
        };
        ResetPasswordDto: {
            token: string;
            password: string;
        };
        OrgDto_Output: {
            id: string;
            name: string;
            slug: string;
            createdAt: string;
        };
        MemberListDto_Output: {
            data: {
                userId: string;
                email: string;
                displayName: string;
                /** @enum {string} */
                role: "owner" | "admin" | "studio" | "player";
                /** @enum {string} */
                status: "active" | "invited" | "disabled";
            }[];
        };
        InviteMemberDto: {
            /** Format: email */
            email: string;
            displayName?: string;
            /** @enum {string} */
            role: "owner" | "admin" | "studio" | "player";
        };
        MemberDto_Output: {
            userId: string;
            email: string;
            displayName: string;
            /** @enum {string} */
            role: "owner" | "admin" | "studio" | "player";
            /** @enum {string} */
            status: "active" | "invited" | "disabled";
        };
        ChangeRoleDto: {
            /** @enum {string} */
            role: "owner" | "admin" | "studio" | "player";
            /** @enum {boolean} */
            confirm: true;
        };
        UpdateMemberStatusDto: {
            /** @enum {string} */
            status: "active" | "disabled";
        };
        GameListDto_Output: {
            data: {
                id: string;
                organizationId: string;
                title: string;
                slug: string;
                description: string | null;
                genre: string | null;
                platform: string | null;
                /** @enum {string} */
                status: "draft" | "active" | "archived";
                coverUrl: string | null;
                bannerUrl: string | null;
                metrics: {
                    testsTotal: number;
                    testsActive: number;
                    sessionsValid: number;
                    playersTotal: number;
                    averageRating: number | null;
                };
                createdAt: string;
                updatedAt: string;
            }[];
            nextCursor: string[];
        };
        GameDto_Output: {
            id: string;
            organizationId: string;
            title: string;
            slug: string;
            description: string[];
            genre: string[];
            platform: string[];
            /** @enum {string} */
            status: "draft" | "active" | "archived";
            coverUrl: string[];
            bannerUrl: string[];
            metrics: {
                testsTotal: number;
                testsActive: number;
                sessionsValid: number;
                playersTotal: number;
                averageRating: number | null;
            };
            createdAt: string;
            updatedAt: string;
        };
        CreateGameDto: {
            title: string;
            slug?: string;
            description?: string;
            genre?: string;
            platform?: string;
            /** @enum {string} */
            status?: "draft" | "active" | "archived";
        };
        UpdateGameDto: {
            title?: string;
            slug?: string;
            description?: string;
            genre?: string;
            platform?: string;
            /** @enum {string} */
            status?: "draft" | "active" | "archived";
        };
        AssetUploadUrlRequestDto: {
            /** @enum {string} */
            kind: "cover" | "banner" | "screenshot";
            /** @enum {string} */
            contentType: "image/png" | "image/jpeg" | "image/webp";
            sizeBytes: number;
            fileName: string;
        };
        UploadUrlResponseDto_Output: {
            uploadUrl: string;
            storageKey: string;
            expiresAt: string;
            maxSizeBytes?: number;
            uploadId?: string;
        };
        ConfirmAssetRequestDto: {
            /** @enum {string} */
            kind: "cover" | "banner" | "screenshot";
            storageKey: string;
        };
        GameAssetDto_Output: {
            id: string;
            /** @enum {string} */
            kind: "cover" | "banner" | "screenshot";
            url: string;
            contentType: string[];
            sizeBytes: number | null;
            createdAt: string;
        };
        RecordingUploadUrlRequestDto: {
            /** @enum {string} */
            contentType: "video/webm" | "video/mp4" | "audio/webm" | "audio/ogg" | "audio/mp4";
            sizeBytes: number;
            partNumber?: number;
            uploadId?: string;
            /** @enum {string} */
            kind?: "screen_recording" | "webcam" | "microphone";
        };
        RecordingCompleteRequestDto: {
            storageKey: string;
            durationMs: number;
            sizeBytes?: number;
            uploadId?: string;
            parts?: {
                partNumber: number;
                etag: string;
            }[];
        };
        RecordingDto_Output: {
            id: string;
            sessionId: string;
            /** @enum {string} */
            status: "processing" | "ready" | "failed" | "unavailable";
            durationMs: number | null;
            createdAt: string;
        };
        PlaybackUrlResponseDto_Output: {
            /** @enum {string} */
            status: "processing" | "ready" | "failed" | "unavailable";
            url: string[];
            expiresAt: string[];
            durationMs: number | null;
            thumbnailUrl: string[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AuditController_list: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
                actorUserId?: string;
                action?: string;
                entity?: string;
                entityId?: string;
                from?: string;
                to?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuditLogListDto_Output"];
                };
            };
        };
    };
    HealthController_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponseDto_Output"];
                };
            };
        };
    };
    AuthController_signupStudio: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupStudioDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponseDto_Output"];
                };
            };
        };
    };
    AuthController_signupPlayer: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignupPlayerDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponseDto_Output"];
                };
            };
        };
    };
    AuthController_checkAvailability: {
        parameters: {
            query: {
                email: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignupAvailabilityDto_Output"];
                };
            };
        };
    };
    AuthController_refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponseDto_Output"];
                };
            };
        };
    };
    AuthController_logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto_Output"];
                };
            };
        };
    };
    AuthController_me: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthUserDto_Output"];
                };
            };
        };
    };
    AuthController_forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto_Output"];
                };
            };
        };
    };
    AuthController_resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto_Output"];
                };
            };
        };
    };
    OrgsController_current: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrgDto_Output"];
                };
            };
        };
    };
    OrgsController_members: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberListDto_Output"];
                };
            };
        };
    };
    OrgsController_invite: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InviteMemberDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberDto_Output"];
                };
            };
        };
    };
    OrgsController_changeRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeRoleDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberDto_Output"];
                };
            };
        };
    };
    OrgsController_updateStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMemberStatusDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MemberDto_Output"];
                };
            };
        };
    };
    OrgsController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GamesController_list: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
                q?: string;
                status?: "draft" | "active" | "archived";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameListDto_Output"];
                };
            };
        };
    };
    GamesController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGameDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameDto_Output"];
                };
            };
        };
    };
    GamesController_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameDto_Output"];
                };
            };
        };
    };
    GamesController_remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    GamesController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateGameDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameDto_Output"];
                };
            };
        };
    };
    GamesController_createAssetUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssetUploadUrlRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadUrlResponseDto_Output"];
                };
            };
        };
    };
    GamesController_confirmAsset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmAssetRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameAssetDto_Output"];
                };
            };
        };
    };
    GamesController_removeAsset: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                assetId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    MediaController_createUploadUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordingUploadUrlRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UploadUrlResponseDto_Output"];
                };
            };
        };
    };
    MediaController_complete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordingCompleteRequestDto"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RecordingDto_Output"];
                };
            };
        };
    };
    MediaController_playbackUrl: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                recordingId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlaybackUrlResponseDto_Output"];
                };
            };
        };
    };
}
