CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS user_comments
(
    user_comment character varying(10000) COLLATE pg_catalog."default" NOT NULL,
    author character varying(255) COLLATE pg_catalog."default" NOT NULL,
    comment_date timestamp with time zone NOT NULL DEFAULT now(),
    user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS user_posts
(
    user_post character varying(10000) COLLATE pg_catalog."default" NOT NULL,
    author character varying(255) COLLATE pg_catalog."default" NOT NULL,
    post_id uuid NOT NULL DEFAULT uuid_generate_v1(),
    post_date character varying(32) COLLATE pg_catalog."default" NOT NULL,
    PRIMARY KEY (post_id)
);
