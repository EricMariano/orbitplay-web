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
    "/participations/{id}/result": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Resultado da participação
         * @description Tela 19. RN-01/02: XP, nota e conquistas só saem **depois da validação
         *     da sessão**; enquanto isso, `status: in_review` e os valores vêm nulos.
         *
         *     RN-03: recarregar não duplica XP nem conquista — a transição é única e
         *     transacional. Esta rota é leitura pura.
         *
         *     RN-04: o crédito financeiro está deferido. `rewardCents` é informativo e
         *     `rewardStatus` permanece `pending`.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: components["parameters"]["Id"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resultado ou estado de análise */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ParticipationResult"];
                    };
                };
                404: components["responses"]["NotFound"];
            };
        };
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
        /**
         * Enviar a avaliação da sessão
         * @description RN-01 (Tela 18): perguntas obrigatórias não respondidas bloqueiam o
         *     envio → `422` com erro por campo (`fieldErrors`, chaveado por
         *     `questionId`).
         *
         *     RN-02: as respostas ficam vinculadas à sessão e ao jogador autenticado.
         *
         *     RN-03: envio duplicado não gera segunda avaliação — com a mesma
         *     `Idempotency-Key`, devolve a resposta original; sem ela, `409`.
         */
        post: {
            parameters: {
                query?: never;
                header: {
                    /**
                     * @description Chave única por tentativa, gerada pelo cliente (UUID). Repetir a chave
                     *     **reproduz a resposta original** em vez de executar a operação de novo.
                     */
                    "Idempotency-Key": components["parameters"]["IdempotencyKey"];
                };
                path: {
                    id: components["parameters"]["Id"];
                };
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": components["schemas"]["FormResponseRequest"];
                };
            };
            responses: {
                /** @description Avaliação registrada */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["FormResponse"];
                    };
                };
                404: components["responses"]["NotFound"];
                /** @description Avaliação já enviada para esta sessão */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["ErrorEnvelope"];
                    };
                };
                422: components["responses"]["ValidationError"];
            };
        };
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
        /**
         * Resumo da sessão para o jogador
         * @description Tela 18. Traz o resumo, a prévia da gravação e o formulário a responder.
         *
         *     RN-05 (Tela 18): os dados brutos da sessão são somente leitura para o
         *     jogador.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: components["parameters"]["Id"];
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Resumo da sessão */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["SessionSummary"];
                    };
                };
                404: components["responses"]["NotFound"];
            };
        };
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
        ParticipationResult: {
            /**
             * @description 'RN-02 (Tela 19): enquanto `in_review`, os valores abaixo vêm nulos.
             *     Não exiba número provisório.'
             * @enum {string}
             */
            status: "in_review" | "completed" | "rejected";
            xpEarned?: number | null;
            level?: number | null;
            /** Format: float */
            feedbackQuality?: number | null;
            /** Format: float */
            rating?: number | null;
            achievementsUnlocked?: components["schemas"]["Achievement"][];
            /** @description Informativo. O crédito em carteira está deferido. */
            rewardCents?: number | null;
            /**
             * @description Permanece `pending` enquanto a carteira não existir.
             * @enum {string}
             */
            rewardStatus?: "pending" | "credited" | "rejected";
            rejectedReason?: string | null;
        };
        FormResponseRequest: {
            answers: components["schemas"]["AnswerInput"][];
        };
        FormResponse: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            sessionId: string;
            /** Format: date-time */
            submittedAt: string;
        };
        /**
         * @description Envelope único de erro da API. Serializado exclusivamente pelo
         *     `HttpExceptionFilter` — nenhum controller monta erro à mão.
         */
        ErrorEnvelope: {
            /** @example 422 */
            statusCode: number;
            code: components["schemas"]["ErrorCode"];
            /** @example Dados inválidos */
            message: string;
            /**
             * @description Mensagem por campo, presente em falhas de validação.
             * @example {
             *       "title": "Título obrigatório"
             *     }
             */
            fieldErrors?: {
                [key: string]: string;
            };
            /** @description Correlaciona a resposta com os logs estruturados. */
            requestId: string;
        };
        Achievement: {
            key: string;
            name: string;
            description?: string;
            /** Format: uri */
            iconUrl?: string | null;
        };
        AnswerInput: {
            /** Format: uuid */
            questionId: string;
            /**
             * @description Texto, número, booleano ou lista de ids de opção, conforme o tipo da
             *     pergunta.
             */
            value: string | number | boolean | string[];
        };
        /** @enum {string} */
        ErrorCode: "VALIDATION_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "CONFLICT" | "TOO_MANY_REQUESTS" | "UNPROCESSABLE_ENTITY" | "INTERNAL_ERROR";
        SessionSummary: {
            session: components["schemas"]["Session"];
            test: components["schemas"]["PlayerTest"];
            game: components["schemas"]["Game"];
            recording?: components["schemas"]["PlaybackUrlResponse"];
            form: components["schemas"]["TestForm"];
            /** @description RN-03 (Tela 18): `true` bloqueia novo envio. */
            alreadySubmitted?: boolean;
        };
        Session: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            participationId: string;
            /** Format: uuid */
            testId?: string;
            /** @enum {string} */
            status: "active" | "finishing" | "in_review" | "valid" | "invalid" | "abandoned";
            /** Format: date-time */
            startedAt: string;
            /** Format: date-time */
            endedAt?: string | null;
            durationMs?: number | null;
            invalidReason?: string | null;
        };
        PlayerTest: {
            modelKey?: components["schemas"]["TestModelKey"];
            participation?: components["schemas"]["Participation"] | null;
        } & WithRequired<components["schemas"]["FeedItem"], "testId" | "gameId" | "cta" | "disabled">;
        Game: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            organizationId: string;
            title: string;
            slug: string;
            description?: string | null;
            genre?: string | null;
            platform?: string | null;
            status: components["schemas"]["GameStatus"];
            /** Format: uri */
            coverUrl?: string | null;
            /** Format: uri */
            bannerUrl?: string | null;
            metrics?: components["schemas"]["GameMetrics"];
            /** Format: date-time */
            createdAt: string;
            /** Format: date-time */
            updatedAt: string;
        };
        PlaybackUrlResponse: {
            status: components["schemas"]["ProcessingStatus"];
            /**
             * Format: uri
             * @description Nulo quando `status` não é `ready`.
             */
            url?: string | null;
            /** Format: date-time */
            expiresAt?: string | null;
            durationMs?: number | null;
            /** Format: uri */
            thumbnailUrl?: string | null;
        };
        TestForm: {
            /** Format: uuid */
            testId: string;
            questions: components["schemas"]["FormQuestion"][];
        };
        FeedItem: {
            /** Format: uuid */
            testId: string;
            /** Format: uuid */
            gameId: string;
            title: string;
            genre?: string | null;
            /** Format: uri */
            coverUrl?: string | null;
            rewardCents?: number | null;
            durationMinutes?: number | null;
            spotsLeft?: number | null;
            /** Format: date-time */
            expiresAt?: string | null;
            platforms?: components["schemas"]["Platform"][];
            cta: components["schemas"]["TestCta"];
            /**
             * @description 'RN-03 (Tela 14): incompatível ou indisponível aparece desabilitado
             *     com motivo, em vez de sumir sem explicação.'
             */
            disabled: boolean;
            disabledReason?: string | null;
            /**
             * @description Item pago. Sempre `false` nesta fase. Quando o impulsionamento
             *     voltar, a UI **precisa** rotular o item — publicidade não
             *     identificada é questão regulatória.
             * @default false
             */
            promoted: boolean;
        };
        /** @enum {string} */
        TestModelKey: "free_exploration_telemetry" | "free_exploration" | "ab_test" | "ab_test_images";
        Participation: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            testId: string;
            /** Format: uuid */
            gameId?: string;
            status: components["schemas"]["ParticipationStatus"];
            /** Format: uuid */
            currentSessionId?: string | null;
            /** @description RN-02 (Tela 13): ponto de retomada permitido pelo modelo. */
            resumePoint?: string | null;
            consentsGranted?: boolean;
            build?: components["schemas"]["Build"];
            /** Format: date-time */
            startedAt?: string | null;
            /** Format: date-time */
            completedAt?: string | null;
        };
        /** @enum {string} */
        GameStatus: "draft" | "active" | "archived";
        /**
         * @description RN-03 (Tela 03): agregados a partir dos testes do jogo, calculados no
         *     backend.
         */
        GameMetrics: {
            testsTotal?: number;
            testsActive?: number;
            sessionsValid?: number;
            playersTotal?: number;
            /** Format: float */
            averageRating?: number | null;
        };
        /**
         * @description Estado de um recurso que depende de job assíncrono. Enquanto
         *     `processing`, a UI mostra o estado — nunca um valor provisório
         *     disfarçado de definitivo.
         * @enum {string}
         */
        ProcessingStatus: "processing" | "ready" | "failed" | "unavailable";
        FormQuestion: {
            /** Format: uuid */
            id: string;
            type: components["schemas"]["QuestionType"];
            prompt: string;
            helpText?: string | null;
            required: boolean;
            /** @description RN-03 (Tela 07): a ordem persistida é esta, não a do array. */
            position: number;
            /**
             * @description 'RN-02: obrigatório para `single_choice` e `multiple_choice`, com no
             *     mínimo duas opções.'
             */
            options?: components["schemas"]["FormOption"][];
            scaleMin?: number | null;
            scaleMax?: number | null;
        };
        /** @enum {string} */
        Platform: "windows" | "macos" | "linux" | "android" | "ios" | "web";
        /**
         * @description RN-01 (Tela 15): calculado no backend, nunca inferido na UI.
         * @enum {string}
         */
        TestCta: "start" | "continue" | "completed" | "in_review" | "downloading" | "unavailable";
        /**
         * @description Máquina de estados da participação, alinhada às telas do fluxo do
         *     jogador: `tutorial` (Tela 16), `playing` (Tela 17), `form_pending`
         *     (Tela 18) e `in_review` (Tela 19).
         * @enum {string}
         */
        ParticipationStatus: "reserved" | "tutorial" | "downloading" | "ready" | "playing" | "form_pending" | "in_review" | "completed" | "rejected" | "abandoned";
        Build: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            testId?: string;
            /** @enum {string} */
            status: "uploading" | "processing" | "validated" | "failed";
            platform?: components["schemas"]["Platform"];
            version?: string | null;
            sizeBytes?: number | null;
            checksum?: string | null;
            /**
             * @description Lista de etapas, **não** um booleano. A leitura do manifesto do
             *     Orbit Plug-in entra aqui como mais uma etapa quando voltar ao
             *     escopo, sem alterar o formato.
             */
            validationSteps: components["schemas"]["ValidationStep"][];
            /** @description RN-05 (Tela 08): diz o que corrigir para tentar de novo. */
            failureReason?: string | null;
            /** Format: date-time */
            createdAt?: string;
        };
        /** @enum {string} */
        QuestionType: "short_text" | "long_text" | "single_choice" | "multiple_choice" | "scale" | "rating" | "boolean";
        FormOption: {
            /** Format: uuid */
            id?: string;
            label: string;
            position?: number;
        };
        ValidationStep: {
            /** @enum {string} */
            key: "checksum" | "malware_scan" | "metadata" | "platform_support";
            /** @enum {string} */
            status: "pending" | "running" | "passed" | "failed" | "skipped";
            message?: string | null;
        };
    };
    responses: {
        /**
         * @description Recurso inexistente — ou pertencente a outra organização. As duas
         *     situações respondem igual, de propósito, para não vazar existência.
         */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
        /** @description Dados inválidos, com erro por campo em `fieldErrors` */
        ValidationError: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": components["schemas"]["ErrorEnvelope"];
            };
        };
    };
    parameters: {
        Id: string;
        /**
         * @description Chave única por tentativa, gerada pelo cliente (UUID). Repetir a chave
         *     **reproduz a resposta original** em vez de executar a operação de novo.
         */
        IdempotencyKey: string;
    };
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
type WithRequired<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};
