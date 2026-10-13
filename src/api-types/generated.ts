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
    "/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["HealthController_ready"];
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
        patch: operations["OrgsController_updateCurrent"];
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
        patch: operations["OrgsController_changeStatus"];
        trace?: never;
    };
    "/orgs/members/{userId}/password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["OrgsController_triggerPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
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
        delete: operations["OrgsController_removeMember"];
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
    "/games/{id}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamesController_summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}/specs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamesController_specs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
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
    "/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["NotificationsController_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/notifications/{id}/read": {
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
        patch: operations["NotificationsController_markRead"];
        trace?: never;
    };
    "/test-models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestModelsController_list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/test-models/{key}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestModelsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{gameId}/tests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestsController_listByGame"];
        put?: never;
        post: operations["TestsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/model": {
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
        patch: operations["TestsController_setModel"];
        trace?: never;
    };
    "/tests/{id}/form": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: operations["TestsController_putForm"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/form/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestsController_formPreview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/build/upload-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["TestsController_createBuildUploadUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/build": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["TestsController_getBuild"];
        put?: never;
        post: operations["TestsController_confirmBuild"];
        delete: operations["TestsController_deleteBuild"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/audience": {
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
        patch: operations["TestsController_setAudience"];
        trace?: never;
    };
    "/tests/{id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["TestsController_publish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/status": {
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
        patch: operations["TestsController_setStatus"];
        trace?: never;
    };
    "/builds/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["BuildsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{id}/compatibility": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["BuildsController_checkCompatibility"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/builds/{id}/download-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["BuildsController_getDownloadUrl"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/player/tests/{testId}/participations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ParticipationsController_join"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/participations/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ParticipationsController_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/participations/{id}/tutorial": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ParticipationsController_tutorial"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/participations/{id}/consents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ParticipationsController_consents"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/participations/{id}/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ParticipationsController_startSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/participations/{id}/result": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ParticipationsController_result"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/devices": {
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
        patch: operations["SessionsController_devices"];
        trace?: never;
    };
    "/sessions/{id}/heartbeat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SessionsController_heartbeat"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/finish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SessionsController_finish"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["SessionsController_summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/form-response": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["SessionsController_formResponse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{gameId}/community/posts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CommunityController_listPosts"];
        put?: never;
        post: operations["CommunityController_createPost"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/community/posts/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["CommunityController_reportPost"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/community/posts/{id}/moderate": {
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
        patch: operations["CommunityController_moderatePost"];
        trace?: never;
    };
    "/games/{gameId}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["CommunityController_listReviews"];
        put?: never;
        post: operations["CommunityController_createReview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{gameId}/chat/channels": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ChatController_listChannels"];
        put?: never;
        post: operations["ChatController_createChannel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/channels/{id}": {
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
        patch: operations["ChatController_updateChannel"];
        trace?: never;
    };
    "/chat/channels/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ChatController_listMessages"];
        put?: never;
        post: operations["ChatController_sendMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/chat/messages/{id}/moderate": {
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
        patch: operations["ChatController_moderateMessage"];
        trace?: never;
    };
    "/player/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamificationController_getProgress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/player/achievements": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamificationController_listAchievements"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/player/missions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamificationController_listMissions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/rankings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["GamificationController_getRankings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{testId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReportsController_getReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{testId}/report/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReportsController_listSessions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{testId}/report/sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReportsController_getSessionEvaluation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{testId}/report/exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["ReportsController_requestExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{testId}/report/exports/{exportId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["ReportsController_getExport"];
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
                actorUserId: string | null;
                actorEmail: string | null;
                action: string;
                entity: string;
                entityId: string | null;
                before: unknown;
                after: unknown;
                createdAt: string;
            }[];
            nextCursor: string[];
        };
        LoginDto: {
            /** Format: email */
            email: string;
            password: string;
            organizationId?: string;
        };
        LoginResultDto_Output: {
            accessToken: string;
            user: {
                id: string;
                email: string;
                displayName: string;
                organizationId: string;
                /** @enum {string} */
                role: "owner" | "admin" | "studio" | "player";
            };
        } | {
            /** @enum {boolean} */
            requiresOrganizationSelection: true;
            organizations: {
                organizationId: string;
                organizationName: string;
                /** @enum {string} */
                role: "owner" | "admin" | "studio" | "player";
            }[];
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
        UpdateOrgDto: {
            name?: string;
            slug?: string;
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
            nextCursor: string[];
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
        ChangeStatusDto: {
            /** @enum {string} */
            status: "active" | "invited" | "disabled";
            /** @enum {boolean} */
            confirm: true;
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
        GameSummaryDto_Output: {
            game: {
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
            };
            /** @enum {string} */
            availability: "available" | "unavailable";
            metrics: {
                testsTotal: number;
                testsActive: number;
                sessionsValid: number;
                playersTotal: number;
                averageRating: number | null;
            };
            canEdit: boolean;
        };
        GameSpecsDto_Output: {
            minimumRequirements?: {
                [key: string]: string;
            };
            recommendedRequirements?: {
                [key: string]: string;
            };
            supportedPlatforms?: ("windows" | "macos" | "linux" | "android" | "ios" | "web")[];
            languages?: string[];
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
        AssetUploadUrlResponseDto_Output: {
            uploadUrl: string;
            storageKey: string;
            expiresAt: string;
            maxSizeBytes: number;
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
        RecordingUploadUrlResponseDto_Output: {
            uploadUrl: string;
            storageKey: string;
            expiresAt: string;
            maxSizeBytes?: number;
            uploadId?: string;
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
        NotificationListDto_Output: {
            data: {
                id: string;
                type: string;
                title: string;
                body: string | null;
                link: string | null;
                read: boolean;
                createdAt: string;
            }[];
            nextCursor: string[];
            unreadCount: number;
        };
        TestModelListDto_Output: {
            data: {
                /** @enum {string} */
                key: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
                name: string;
                description: string;
                deliverables: string[];
                technicalRequirements: string[];
                requiresTelemetry: boolean;
                requiresBuild: boolean;
                available: boolean;
                unavailableReason: string | null;
            }[];
        };
        TestModelDto_Output: {
            /** @enum {string} */
            key: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
            name: string;
            description: string;
            deliverables: string[];
            technicalRequirements: string[];
            requiresTelemetry: boolean;
            requiresBuild: boolean;
            available: boolean;
            unavailableReason: string[];
        };
        CreateTestDto: {
            /** @enum {string} */
            testModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
            title?: string;
        };
        TestDto_Output: {
            id: string;
            gameId: string;
            organizationId: string;
            title: string[];
            /** @enum {string} */
            status: "draft" | "published" | "paused" | "finished" | "expired";
            /** @enum {string} */
            testModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
            currentStep: number;
            pendingValidations: {
                step: number;
                code: string;
                message: string;
            }[];
            audience: {
                locations: string[];
                archetypes: string[];
                ageMin: number;
                ageMax: number;
                quantity: number;
                durationDays: number;
                deviceRequirements: ("windows" | "macos" | "linux" | "android" | "ios" | "web")[];
                keepActive: boolean;
                estimatedReach: number;
            } | null;
            build: {
                id: string;
                testId: string;
                /** @enum {string} */
                status: "awaiting_upload" | "uploading" | "processing" | "validated" | "failed";
                /** @enum {string|null} */
                platform: "windows" | "macos" | "linux" | "android" | "ios" | "web" | null;
                version: string | null;
                sizeBytes: number | null;
                checksum: string | null;
                validationSteps: {
                    /** @enum {string} */
                    key: "checksum" | "malware_scan" | "metadata" | "plugin_manifest";
                    /** @enum {string} */
                    status: "processing" | "ready" | "failed" | "unavailable";
                    message: string | null;
                }[];
                failureReason: string | null;
                createdAt: string;
            } | null;
            spotsTotal: number | null;
            spotsTaken: number | null;
            rewardCents: number | null;
            expiresAt: string[];
            publishedAt: string[];
            createdAt: string;
            updatedAt: string;
        };
        TestListDto_Output: {
            data: {
                id: string;
                gameId: string;
                organizationId: string;
                title: string | null;
                /** @enum {string} */
                status: "draft" | "published" | "paused" | "finished" | "expired";
                /** @enum {string} */
                testModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
                currentStep: number;
                pendingValidations: {
                    step: number;
                    code: string;
                    message: string;
                }[];
                audience: {
                    locations: string[];
                    archetypes: string[];
                    ageMin: number;
                    ageMax: number;
                    quantity: number;
                    durationDays: number;
                    deviceRequirements: ("windows" | "macos" | "linux" | "android" | "ios" | "web")[];
                    keepActive: boolean;
                    estimatedReach: number;
                } | null;
                build: {
                    id: string;
                    testId: string;
                    /** @enum {string} */
                    status: "awaiting_upload" | "uploading" | "processing" | "validated" | "failed";
                    /** @enum {string|null} */
                    platform: "windows" | "macos" | "linux" | "android" | "ios" | "web" | null;
                    version: string | null;
                    sizeBytes: number | null;
                    checksum: string | null;
                    validationSteps: {
                        /** @enum {string} */
                        key: "checksum" | "malware_scan" | "metadata" | "plugin_manifest";
                        /** @enum {string} */
                        status: "processing" | "ready" | "failed" | "unavailable";
                        message: string | null;
                    }[];
                    failureReason: string | null;
                    createdAt: string;
                } | null;
                spotsTotal: number | null;
                spotsTaken: number | null;
                rewardCents: number | null;
                expiresAt: string | null;
                publishedAt: string | null;
                createdAt: string;
                updatedAt: string;
            }[];
            nextCursor: string[];
        };
        SetModelDto: {
            /** @enum {string} */
            testModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
        };
        PutFormDto: {
            questions: {
                id?: string;
                /** @enum {string} */
                type: "scale" | "single_choice" | "multiple_choice" | "open_text" | "boolean" | "nps";
                prompt: string;
                helpText?: string;
                required: boolean;
                position: number;
                options?: {
                    id?: string;
                    label: string;
                    position: number;
                }[];
                scaleMin?: number;
                scaleMax?: number;
            }[];
        };
        TestFormDto_Output: {
            testId: string;
            questions: {
                id: string;
                /** @enum {string} */
                type: "scale" | "single_choice" | "multiple_choice" | "open_text" | "boolean" | "nps";
                prompt: string;
                helpText: string | null;
                required: boolean;
                position: number;
                options: {
                    id: string;
                    label: string;
                    position: number;
                }[];
                scaleMin: number | null;
                scaleMax: number | null;
            }[];
        };
        BuildUploadUrlRequestDto: {
            fileName: string;
            contentType: string;
            sizeBytes: number;
            /** @enum {string} */
            platform: "windows" | "macos" | "linux" | "android" | "ios" | "web";
            version?: string;
        };
        BuildUploadUrlResponseDto_Output: {
            uploadUrl: string;
            storageKey: string;
            expiresAt: string;
            maxSizeBytes: number;
        };
        ConfirmBuildRequestDto: {
            storageKey: string;
            /** @enum {string} */
            platform: "windows" | "macos" | "linux" | "android" | "ios" | "web";
            version?: string;
            checksum?: string;
        };
        BuildDto_Output: {
            id: string;
            testId: string;
            /** @enum {string} */
            status: "awaiting_upload" | "uploading" | "processing" | "validated" | "failed";
            /** @enum {string|null} */
            platform: "windows" | "macos" | "linux" | "android" | "ios" | "web" | null;
            version: string[];
            sizeBytes: number | null;
            checksum: string[];
            validationSteps: {
                /** @enum {string} */
                key: "checksum" | "malware_scan" | "metadata" | "plugin_manifest";
                /** @enum {string} */
                status: "processing" | "ready" | "failed" | "unavailable";
                message: string | null;
            }[];
            failureReason: string[];
            createdAt: string;
        };
        AudienceRequestDto: {
            locations?: string[];
            archetypes?: string[];
            ageMin: number;
            ageMax: number;
            quantity: number;
            durationDays: number;
            deviceRequirements?: ("windows" | "macos" | "linux" | "android" | "ios" | "web")[];
            /** @default false */
            keepActive: boolean;
        };
        SetStatusDto: {
            /** @enum {string} */
            status: "paused" | "published" | "finished";
        };
        CompatibilityReportDto_Output: {
            compatible: boolean;
            reasons: string[];
            supportedPlatforms: ("windows" | "macos" | "linux" | "android" | "ios" | "web")[];
        };
        DownloadUrlResponseDto_Output: {
            needsDownload: boolean;
            downloadUrl: string[];
            expiresAt: string[];
            version: string[];
            checksum: string[];
            sizeBytes: number | null;
            supportsRange: boolean;
        };
        ParticipationDto_Output: {
            id: string;
            testId: string;
            gameId: string;
            /** @enum {string} */
            status: "reserved" | "tutorial" | "downloading" | "ready" | "playing" | "form_pending" | "in_review" | "completed" | "rejected" | "abandoned";
            currentSessionId: string[];
            resumePoint: string[];
            consentsGranted: boolean;
            build: {
                id: string;
                testId: string;
                /** @enum {string} */
                status: "awaiting_upload" | "uploading" | "processing" | "validated" | "failed";
                /** @enum {string|null} */
                platform: "windows" | "macos" | "linux" | "android" | "ios" | "web" | null;
                version: string | null;
                sizeBytes: number | null;
                checksum: string | null;
                validationSteps: {
                    /** @enum {string} */
                    key: "checksum" | "malware_scan" | "metadata" | "plugin_manifest";
                    /** @enum {string} */
                    status: "processing" | "ready" | "failed" | "unavailable";
                    message: string | null;
                }[];
                failureReason: string | null;
                createdAt: string;
            } | null;
            startedAt: string[];
            completedAt: string[];
        };
        TutorialDto_Output: {
            /** @enum {string} */
            modelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
            steps: {
                title: string;
                body: string;
                mediaUrl: string | null;
            }[];
            requiredConsents: ("screen_recording" | "audio" | "microphone" | "webcam")[];
        };
        ConsentRequestDto: {
            consents: {
                /** @enum {string} */
                kind: "screen_recording" | "audio" | "microphone" | "webcam";
                granted: boolean;
            }[];
        };
        ConsentRecordDto_Output: {
            participationId: string;
            consents: {
                /** @enum {string} */
                kind: "screen_recording" | "audio" | "microphone" | "webcam";
                granted: boolean;
            }[];
            recordedAt: string;
            allRequiredGranted: boolean;
        };
        StartSessionRequestDto: {
            buildVersion: string;
            /** @enum {string} */
            platform: "windows" | "macos" | "linux" | "android" | "ios" | "web";
            deviceInfo?: {
                [key: string]: unknown;
            };
        };
        SessionStartedDto_Output: {
            sessionId: string;
            startedAt: string;
            maxDurationMs: number | null;
            heartbeatIntervalMs: number;
            recordingRequired: boolean;
        };
        ParticipationResultDto_Output: {
            /** @enum {string} */
            status: "in_review" | "completed" | "rejected";
            xpEarned: number | null;
            rating: number[];
            rewardCents: number | null;
            /** @enum {string} */
            rewardStatus: "pending" | "approved" | "paid";
            invalidReason: string[];
        };
        DeviceEventRequestDto: {
            /** @enum {string} */
            kind: "microphone" | "webcam";
            enabled: boolean;
            tMs: number;
        };
        HeartbeatRequestDto: {
            tMs: number;
            /** @enum {string} */
            connectionQuality?: "good" | "degraded" | "poor";
        };
        FinishSessionRequestDto: {
            tMs: number;
            /** @enum {boolean} */
            confirmed: true;
            /** @enum {string} */
            reason?: "completed" | "gave_up" | "technical_failure";
        };
        SessionDto_Output: {
            id: string;
            participationId: string;
            testId: string;
            /** @enum {string} */
            status: "active" | "finishing" | "in_review" | "valid" | "invalid" | "abandoned";
            startedAt: string;
            endedAt: string[];
            durationMs: number | null;
            invalidReason: string[];
        };
        SessionSummaryDto_Output: {
            session: {
                id: string;
                participationId: string;
                testId: string;
                /** @enum {string} */
                status: "active" | "finishing" | "in_review" | "valid" | "invalid" | "abandoned";
                startedAt: string;
                endedAt: string | null;
                durationMs: number | null;
                invalidReason: string | null;
            };
            test: {
                id: string;
                gameId: string;
                title: string | null;
                /** @enum {string} */
                testModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
                /** @enum {string} */
                status: "draft" | "published" | "paused" | "finished" | "expired";
                rewardCents: number | null;
                expiresAt: string | null;
            };
            game: {
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
            };
            recording: {
                /** @enum {string} */
                status: "processing" | "ready" | "failed" | "unavailable";
                url: string | null;
                expiresAt: string | null;
                durationMs: number | null;
                thumbnailUrl: string | null;
            } | null;
            form: {
                testId: string;
                questions: {
                    id: string;
                    /** @enum {string} */
                    type: "scale" | "single_choice" | "multiple_choice" | "open_text" | "boolean" | "nps";
                    prompt: string;
                    helpText: string | null;
                    required: boolean;
                    position: number;
                    options: {
                        id: string;
                        label: string;
                        position: number;
                    }[];
                    scaleMin: number | null;
                    scaleMax: number | null;
                }[];
            };
            alreadySubmitted: boolean;
        };
        FormResponseRequestDto: {
            answers: {
                questionId: string;
                value: string | number | boolean | string[];
            }[];
        };
        FormResponseDto_Output: {
            id: string;
            sessionId: string;
            submittedAt: string;
        };
        CommunityPostListDto_Output: {
            data: {
                id: string;
                gameId: string;
                authorUserId: string;
                authorDisplayName: string;
                body: string;
                /** @enum {string} */
                status: "visible" | "hidden" | "removed";
                createdAt: string;
            }[];
            nextCursor: string[];
        };
        CreateCommunityPostRequestDto: {
            body: string;
        };
        CommunityPostDto_Output: {
            id: string;
            gameId: string;
            authorUserId: string;
            authorDisplayName: string;
            body: string;
            /** @enum {string} */
            status: "visible" | "hidden" | "removed";
            createdAt: string;
        };
        ReportPostRequestDto: {
            /** @enum {string} */
            reason: "spam" | "abuse" | "spoiler" | "other";
            details?: string;
        };
        ModeratePostRequestDto: {
            /** @enum {string} */
            action: "hide" | "restore" | "remove";
            reason?: string;
        };
        ReviewListDto_Output: {
            data: {
                id: string;
                gameId: string;
                authorUserId: string;
                authorDisplayName: string;
                rating: number;
                body: string | null;
                createdAt: string;
            }[];
            nextCursor: string[];
            averageRating: number[];
        };
        CreateReviewRequestDto: {
            rating: number;
            body?: string;
        };
        ReviewDto_Output: {
            id: string;
            gameId: string;
            authorUserId: string;
            authorDisplayName: string;
            rating: number;
            body: string[];
            createdAt: string;
        };
        ChatChannelListDto_Output: {
            data: {
                id: string;
                gameId: string;
                slug: string;
                name: string;
                topic: string | null;
                archived: boolean;
                createdAt: string;
            }[];
            nextCursor: string[];
        };
        CreateChatChannelRequestDto: {
            name: string;
            topic?: string;
        };
        ChatChannelDto_Output: {
            id: string;
            gameId: string;
            slug: string;
            name: string;
            topic: string[];
            archived: boolean;
            createdAt: string;
        };
        UpdateChatChannelRequestDto: {
            name?: string;
            topic?: string | null;
            archived?: boolean;
        };
        ChatMessageListDto_Output: {
            data: {
                id: string;
                channelId: string;
                authorUserId: string;
                authorDisplayName: string;
                body: string;
                /** @enum {string} */
                status: "visible" | "hidden" | "removed";
                createdAt: string;
            }[];
            nextCursor: string[];
        };
        SendChatMessageRequestDto: {
            body: string;
        };
        ChatMessageDto_Output: {
            id: string;
            channelId: string;
            authorUserId: string;
            authorDisplayName: string;
            body: string;
            /** @enum {string} */
            status: "visible" | "hidden" | "removed";
            createdAt: string;
        };
        ModerateChatMessageRequestDto: {
            /** @enum {string} */
            action: "hide" | "restore" | "remove";
        };
        PlayerProgressDto_Output: {
            level: number;
            xp: number;
            xpToNextLevel: number;
            feedbackQuality: number;
            achievementsUnlocked: number;
            hoursPlayed: number;
            testsCompleted: number;
        };
        PlayerAchievementListDto_Output: {
            data: {
                achievement: {
                    key: string;
                    name: string;
                    description: string | null;
                    iconUrl: string | null;
                };
                unlocked: boolean;
                unlockedAt: string | null;
                progress: number | null;
            }[];
            nextCursor: string[];
        };
        PlayerMissionListDto_Output: {
            data: {
                key: string;
                name: string;
                description: string | null;
                progress: number;
                /** @enum {number} */
                target: 1;
                rewardXp: number | null;
                expiresAt: string | null;
            }[];
        };
        RankingListDto_Output: {
            data: {
                position: number;
                userId: string;
                displayName: string;
                level: number;
                score: number;
                isCurrentUser: boolean;
            }[];
            nextCursor: string[];
            currentUserEntry: {
                position: number;
                userId: string;
                displayName: string;
                level: number;
                score: number;
                isCurrentUser: boolean;
            } | null;
            generatedAt: string[];
        };
        TestReportDto_Output: {
            testId: string;
            blocks: {
                /** @enum {string} */
                key: "overview" | "evolution" | "rating_distribution" | "tester_profile";
                /** @enum {string} */
                status: "processing" | "ready" | "failed" | "unavailable";
                payload: {
                    [key: string]: unknown;
                } | null;
                computedAt: string | null;
            }[];
        };
        ReportSessionListDto_Output: {
            data: {
                sessionId: string;
                participationId: string;
                testerId: string;
                testerName: string;
                status: string;
                startedAt: string;
                endedAt: string | null;
                durationMs: number | null;
                valid: boolean | null;
                averageRating: number | null;
            }[];
            nextCursor: string[];
        };
        SessionEvaluationDto_Output: {
            session: {
                sessionId: string;
                participationId: string;
                testerId: string;
                testerName: string;
                status: string;
                startedAt: string;
                endedAt: string | null;
                durationMs: number | null;
                valid: boolean | null;
                averageRating: number | null;
            };
            submittedAt: string[];
            answers: {
                questionId: string;
                prompt: string;
                type: string;
                valueText: string | null;
                valueNumber: number | null;
                valueBoolean: boolean | null;
                optionLabels: string[];
            }[];
        };
        CreateReportExportDto: {
            /** @enum {string} */
            format: "csv" | "pdf";
        };
        ReportExportDto_Output: {
            id: string;
            testId: string;
            /** @enum {string} */
            format: "csv" | "pdf";
            /** @enum {string} */
            status: "processing" | "ready" | "failed" | "unavailable";
            downloadUrl: string[];
            failureReason: string[];
            createdAt: string;
            completedAt: string[];
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
    HealthController_ready: {
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
                    "application/json": components["schemas"]["LoginResultDto_Output"];
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
    OrgsController_updateCurrent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateOrgDto"];
            };
        };
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
            query?: {
                limit?: number;
                cursor?: string;
                q?: string;
                role?: "owner" | "admin" | "studio" | "player";
                status?: "active" | "invited" | "disabled";
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
    OrgsController_changeStatus: {
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
                "application/json": components["schemas"]["ChangeStatusDto"];
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
    OrgsController_triggerPasswordReset: {
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
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto_Output"];
                };
            };
        };
    };
    OrgsController_removeMember: {
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
    GamesController_summary: {
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
                    "application/json": components["schemas"]["GameSummaryDto_Output"];
                };
            };
        };
    };
    GamesController_specs: {
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
                    "application/json": components["schemas"]["GameSpecsDto_Output"];
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
                    "application/json": components["schemas"]["AssetUploadUrlResponseDto_Output"];
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
                    "application/json": components["schemas"]["RecordingUploadUrlResponseDto_Output"];
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
    NotificationsController_list: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
                unreadOnly?: boolean | ("true" | "false");
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
                    "application/json": components["schemas"]["NotificationListDto_Output"];
                };
            };
        };
    };
    NotificationsController_markRead: {
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
            /** @description Marcada como lida */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    TestModelsController_list: {
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
                    "application/json": components["schemas"]["TestModelListDto_Output"];
                };
            };
        };
    };
    TestModelsController_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                key: string;
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
                    "application/json": components["schemas"]["TestModelDto_Output"];
                };
            };
        };
    };
    TestsController_listByGame: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
                tab?: "active" | "all";
                status?: "draft" | "published" | "paused" | "finished" | "expired";
            };
            header?: never;
            path: {
                gameId: string;
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
                    "application/json": components["schemas"]["TestListDto_Output"];
                };
            };
        };
    };
    TestsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                gameId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    TestsController_get: {
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
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    TestsController_setModel: {
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
                "application/json": components["schemas"]["SetModelDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    TestsController_putForm: {
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
                "application/json": components["schemas"]["PutFormDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestFormDto_Output"];
                };
            };
        };
    };
    TestsController_formPreview: {
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
                    "application/json": components["schemas"]["TestFormDto_Output"];
                };
            };
        };
    };
    TestsController_createBuildUploadUrl: {
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
                "application/json": components["schemas"]["BuildUploadUrlRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BuildUploadUrlResponseDto_Output"];
                };
            };
        };
    };
    TestsController_getBuild: {
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
                    "application/json": components["schemas"]["BuildDto_Output"];
                };
            };
        };
    };
    TestsController_confirmBuild: {
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
                "application/json": components["schemas"]["ConfirmBuildRequestDto"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BuildDto_Output"];
                };
            };
        };
    };
    TestsController_deleteBuild: {
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
    TestsController_setAudience: {
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
                "application/json": components["schemas"]["AudienceRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    TestsController_publish: {
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
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    TestsController_setStatus: {
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
                "application/json": components["schemas"]["SetStatusDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestDto_Output"];
                };
            };
        };
    };
    BuildsController_get: {
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
                    "application/json": components["schemas"]["BuildDto_Output"];
                };
            };
        };
    };
    BuildsController_checkCompatibility: {
        parameters: {
            query: {
                platform: "windows" | "macos" | "linux" | "android" | "ios" | "web";
                os?: string;
                arch?: string;
            };
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
                    "application/json": components["schemas"]["CompatibilityReportDto_Output"];
                };
            };
        };
    };
    BuildsController_getDownloadUrl: {
        parameters: {
            query?: {
                localVersion?: string;
            };
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
                    "application/json": components["schemas"]["DownloadUrlResponseDto_Output"];
                };
            };
        };
    };
    ParticipationsController_join: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                testId: string;
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
                    "application/json": components["schemas"]["ParticipationDto_Output"];
                };
            };
        };
    };
    ParticipationsController_get: {
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
                    "application/json": components["schemas"]["ParticipationDto_Output"];
                };
            };
        };
    };
    ParticipationsController_tutorial: {
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
                    "application/json": components["schemas"]["TutorialDto_Output"];
                };
            };
        };
    };
    ParticipationsController_consents: {
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
                "application/json": components["schemas"]["ConsentRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConsentRecordDto_Output"];
                };
            };
        };
    };
    ParticipationsController_startSession: {
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
                "application/json": components["schemas"]["StartSessionRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionStartedDto_Output"];
                };
            };
        };
    };
    ParticipationsController_result: {
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
                    "application/json": components["schemas"]["ParticipationResultDto_Output"];
                };
            };
        };
    };
    SessionsController_devices: {
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
                "application/json": components["schemas"]["DeviceEventRequestDto"];
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SessionsController_heartbeat: {
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
                "application/json": components["schemas"]["HeartbeatRequestDto"];
            };
        };
        responses: {
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    SessionsController_finish: {
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
                "application/json": components["schemas"]["FinishSessionRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionDto_Output"];
                };
            };
        };
    };
    SessionsController_summary: {
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
                    "application/json": components["schemas"]["SessionSummaryDto_Output"];
                };
            };
        };
    };
    SessionsController_formResponse: {
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
                "application/json": components["schemas"]["FormResponseRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FormResponseDto_Output"];
                };
            };
        };
    };
    CommunityController_listPosts: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
            };
            header?: never;
            path: {
                gameId: string;
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
                    "application/json": components["schemas"]["CommunityPostListDto_Output"];
                };
            };
        };
    };
    CommunityController_createPost: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                gameId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCommunityPostRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommunityPostDto_Output"];
                };
            };
        };
    };
    CommunityController_reportPost: {
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
                "application/json": components["schemas"]["ReportPostRequestDto"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CommunityController_moderatePost: {
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
                "application/json": components["schemas"]["ModeratePostRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CommunityPostDto_Output"];
                };
            };
        };
    };
    CommunityController_listReviews: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
            };
            header?: never;
            path: {
                gameId: string;
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
                    "application/json": components["schemas"]["ReviewListDto_Output"];
                };
            };
        };
    };
    CommunityController_createReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                gameId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReviewRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewDto_Output"];
                };
            };
        };
    };
    ChatController_listChannels: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
            };
            header?: never;
            path: {
                gameId: string;
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
                    "application/json": components["schemas"]["ChatChannelListDto_Output"];
                };
            };
        };
    };
    ChatController_createChannel: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                gameId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateChatChannelRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatChannelDto_Output"];
                };
            };
        };
    };
    ChatController_updateChannel: {
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
                "application/json": components["schemas"]["UpdateChatChannelRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatChannelDto_Output"];
                };
            };
        };
    };
    ChatController_listMessages: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
            };
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
                    "application/json": components["schemas"]["ChatMessageListDto_Output"];
                };
            };
        };
    };
    ChatController_sendMessage: {
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
                "application/json": components["schemas"]["SendChatMessageRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageDto_Output"];
                };
            };
        };
    };
    ChatController_moderateMessage: {
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
                "application/json": components["schemas"]["ModerateChatMessageRequestDto"];
            };
        };
        responses: {
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChatMessageDto_Output"];
                };
            };
        };
    };
    GamificationController_getProgress: {
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
                    "application/json": components["schemas"]["PlayerProgressDto_Output"];
                };
            };
        };
    };
    GamificationController_listAchievements: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
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
                    "application/json": components["schemas"]["PlayerAchievementListDto_Output"];
                };
            };
        };
    };
    GamificationController_listMissions: {
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
                    "application/json": components["schemas"]["PlayerMissionListDto_Output"];
                };
            };
        };
    };
    GamificationController_getRankings: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
                scope?: "global" | "game";
                gameId?: string;
                period?: "week" | "month" | "all";
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
                    "application/json": components["schemas"]["RankingListDto_Output"];
                };
            };
        };
    };
    ReportsController_getReport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                testId: string;
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
                    "application/json": components["schemas"]["TestReportDto_Output"];
                };
            };
        };
    };
    ReportsController_listSessions: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string;
            };
            header?: never;
            path: {
                testId: string;
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
                    "application/json": components["schemas"]["ReportSessionListDto_Output"];
                };
            };
        };
    };
    ReportsController_getSessionEvaluation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                testId: string;
                sessionId: string;
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
                    "application/json": components["schemas"]["SessionEvaluationDto_Output"];
                };
            };
        };
    };
    ReportsController_requestExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                testId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReportExportDto"];
            };
        };
        responses: {
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportExportDto_Output"];
                };
            };
        };
    };
    ReportsController_getExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                testId: string;
                exportId: string;
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
                    "application/json": components["schemas"]["ReportExportDto_Output"];
                };
            };
        };
    };
}
