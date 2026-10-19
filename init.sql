CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS user_comments CASCADE;
DROP TABLE IF EXISTS user_posts CASCADE;
CREATE TABLE IF NOT EXISTS user_posts
(
    post_content character varying(10000) NOT NULL,
    author character varying(255) DEFAULT 'Anonymous',
    post_id uuid NOT NULL DEFAULT uuid_generate_v1(),
    post_date character varying(32) NOT NULL,
    post_title character varying(500) NOT NULL DEFAULT 'A Beautiful Post',
    image_url "char",
    CONSTRAINT user_posts_pkey PRIMARY KEY (post_id),
    CONSTRAINT user_posts_post_id_key UNIQUE (post_id)
);

CREATE TABLE IF NOT EXISTS user_comments
(
    user_comment character varying(10000) DEFAULT 'Anonymous',
    author character varying(255),
    comment_date timestamp with time zone NOT NULL DEFAULT now(),
    comment_id uuid NOT NULL DEFAULT uuid_generate_v1(),
    post_id uuid NOT NULL,
    CONSTRAINT user_comments_pkey PRIMARY KEY (comment_id),
    CONSTRAINT user_comments_post_id_fkey FOREIGN KEY (post_id)
        REFERENCES public.user_posts (post_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

