-- CreateTable
CREATE TABLE "TopAlbumsGeneral" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR DEFAULT '',
    "type" VARCHAR DEFAULT '',
    "total_tracks" BIGINT,
    "release_date" DATE,
    "genres" JSON,
    "artists" JSON,
    "popularity" BIGINT,

    CONSTRAINT "TopAlbumsGeneral_pkey" PRIMARY KEY ("id")
);
