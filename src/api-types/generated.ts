/**
 * GENERATED FILE — do not edit by hand.
 * Produced by `pnpm gen:api` from src/api-types/openapi.json.
 * Fix the API contract instead.
 */

export interface paths {
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Authenticate and start a session */
        post: operations["login"];
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
        /** Exchange the refresh cookie for a fresh access token */
        post: operations["refresh"];
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
        /** End the current session */
        post: operations["logout"];
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
        /** Get the authenticated user */
        get: operations["getCurrentUser"];
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
        /** Request a password reset */
        post: operations["forgotPassword"];
        delete?: never;
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
        /** List games */
        get: operations["listGames"];
        put?: never;
        post?: never;
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
        /** Get a game by id */
        get: operations["getGame"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/test-models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List reusable test models */
        get: operations["listTestModels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/opportunities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List opportunities for the current user */
        get: operations["listOpportunities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/{id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the report for a test run */
        get: operations["getTestReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/wallet": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current player's wallet balance */
        get: operations["getWallet"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/player/profile-stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current player's profile stats (level, feedback quality, achievements, hours played) */
        get: operations["getPlayerProfileStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/continue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the in-progress test the player was last working on, if any */
        get: operations["getContinueTest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/tests/mine": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the current player's tests with progress */
        get: operations["listMyTests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/highlighted": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List games highlighted for the current player */
        get: operations["listHighlightedGames"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/earnings/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current player's earnings summary */
        get: operations["getEarningsSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/missions/ranking": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current player's missions and ranking overview */
        get: operations["getMissionsRanking"];
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
        /**
         * @description Authoritative role, decided by the backend (RN-03). The login tab does NOT set it.
         * @enum {string}
         */
        Role: "owner" | "admin" | "studio" | "player";
        AuthUser: {
            /** Format: uuid */
            userId: string;
            /** Format: email */
            email: string;
            displayName: string;
            /** Format: uuid */
            organizationId: string;
            role: components["schemas"]["Role"];
        };
        LoginRequest: {
            /** @description E-mail or access ID */
            identifier: string;
            /** Format: password */
            password: string;
            /**
             * @description Changes only the refresh-token TTL
             * @default false
             */
            rememberMe: boolean;
        };
        LoginResponse: {
            accessToken: string;
            expiresIn: number;
            user: components["schemas"]["AuthUser"];
        };
        ForgotPasswordRequest: {
            /** Format: email */
            email: string;
        };
        MessageResponse: {
            message: string;
        };
        Game: {
            id: string;
            title: string;
            /** @enum {string} */
            status: "draft" | "in_review" | "published";
            coverUrl?: string | null;
            /** Format: date-time */
            createdAt: string;
        };
        TestModel: {
            id: string;
            name: string;
            description?: string | null;
        };
        Opportunity: {
            id: string;
            title: string;
            gameId?: string | null;
            reward: number;
            /** @enum {string} */
            status: "open" | "in_progress" | "closed";
        };
        TestReport: {
            id: string;
            testId: string;
            summary: string;
            score?: number | null;
            sections?: {
                title: string;
                content: string;
            }[];
        };
        /** @enum {string} */
        ErrorCode: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "TOO_MANY_REQUESTS" | "UNPROCESSABLE_ENTITY" | "INTERNAL_ERROR";
        ErrorEnvelope: {
            statusCode: number;
            code: components["schemas"]["ErrorCode"];
            message: string;
            fieldErrors?: {
                [key: string]: string;
            };
            requestId: string;
        };
        Wallet: {
            balance: number;
        };
        /** @enum {string} */
        PlayerTier: "bronze" | "silver" | "gold" | "elite";
        PlayerStats: {
            tier: components["schemas"]["PlayerTier"];
            level: number;
            feedbackQuality: number;
            achievements: number;
            hoursPlayed: number;
        };
        TestTrackProgress: {
            label: string;
            /** @description 0-100 */
            progress: number;
            reward: number;
        };
        ContinueTest: {
            gameId: string;
            gameTitle: string;
            coverUrl: string | null;
            playersCount: number;
            /** Format: date-time */
            endsAt: string;
            tracks: components["schemas"]["TestTrackProgress"][];
        };
        HighlightedGame: {
            id: string;
            title: string;
            coverUrl: string | null;
            /** @enum {string} */
            status: "available" | "unavailable";
            isNew: boolean;
            playersCount: number;
            /** Format: date-time */
            endsAt: string;
            openTests: number;
            maxReward: number;
            remainingReward: number;
        };
        EarningsPoint: {
            label: string;
            value: number;
        };
        EarningsSummary: {
            last7Days: number;
            totalAccumulated: number;
            nextPayoutInDays: number;
            series: components["schemas"]["EarningsPoint"][];
        };
        RankingCategory: {
            label: string;
            value: number;
        };
        MissionsRanking: {
            rank: number;
            rankDelta: number;
            pending: number;
            nextGoal: number;
            categories: components["schemas"]["RankingCategory"][];
        };
        MyTestProgress: {
            id: string;
            title: string;
            /** @description 0-100 */
            progress: number;
            reward: number;
            /** @enum {string} */
            action: "start" | "continue" | "complete";
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
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Session established */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Invalid credentials */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description Validation error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
            /** @description Too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    refresh: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session rotated */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Refresh failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session ended and refresh cookie cleared */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
        };
    };
    getCurrentUser: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authenticated user */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthUser"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordRequest"];
            };
        };
        responses: {
            /** @description Generic response regardless of account existence */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponse"];
                };
            };
            /** @description Too many requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorEnvelope"];
                };
            };
        };
    };
    listGames: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Games */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Game"][];
                };
            };
        };
    };
    getGame: {
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
            /** @description Game */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Game"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listTestModels: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Test models */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestModel"][];
                };
            };
        };
    };
    listOpportunities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Opportunities */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Opportunity"][];
                };
            };
        };
    };
    getTestReport: {
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
            /** @description Report */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TestReport"];
                };
            };
            /** @description Not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getWallet: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Wallet */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Wallet"];
                };
            };
        };
    };
    getPlayerProfileStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Player profile stats */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PlayerStats"];
                };
            };
        };
    };
    getContinueTest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Continue test, or null when there is none in progress */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContinueTest"] | null;
                };
            };
        };
    };
    listMyTests: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description My tests */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MyTestProgress"][];
                };
            };
        };
    };
    listHighlightedGames: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Highlighted games */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HighlightedGame"][];
                };
            };
        };
    };
    getEarningsSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Earnings summary */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EarningsSummary"];
                };
            };
        };
    };
    getMissionsRanking: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Missions and ranking */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MissionsRanking"];
                };
            };
        };
    };
}
