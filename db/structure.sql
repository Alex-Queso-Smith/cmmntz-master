SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: ar_internal_metadata; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ar_internal_metadata (
    key character varying NOT NULL,
    value character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    title character varying,
    text text,
    author_name character varying,
    author_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comment_interactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_interactions (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    comment_id uuid,
    user_id uuid,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: comment_vote_tabulations; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.comment_vote_tabulations AS
SELECT
    NULL::uuid AS id,
    NULL::uuid AS user_id,
    NULL::uuid AS art_id,
    NULL::character varying AS art_type,
    NULL::text AS text,
    NULL::boolean AS anonymous,
    NULL::timestamp without time zone AS created_at,
    NULL::timestamp without time zone AS updated_at,
    NULL::integer AS interactions_count,
    NULL::integer AS comment_length,
    NULL::bigint AS top_count,
    NULL::bigint AS love_count,
    NULL::bigint AS like_a_lot_count,
    NULL::bigint AS like_count,
    NULL::bigint AS indifferent_count,
    NULL::bigint AS dislike_count,
    NULL::bigint AS dislike_a_lot_count,
    NULL::bigint AS trash_count,
    NULL::bigint AS warn_count,
    NULL::bigint AS smart_count,
    NULL::bigint AS funny_count,
    NULL::bigint AS happy_count,
    NULL::bigint AS shocked_count,
    NULL::bigint AS sad_count,
    NULL::bigint AS boring_count,
    NULL::bigint AS angry_count,
    NULL::numeric AS top_percent,
    NULL::numeric AS love_percent,
    NULL::numeric AS like_a_lot_percent,
    NULL::numeric AS like_percent,
    NULL::numeric AS indifferent_percent,
    NULL::numeric AS dislike_percent,
    NULL::numeric AS dislike_a_lot_percent,
    NULL::numeric AS trash_percent,
    NULL::numeric AS warn_percent,
    NULL::numeric AS smart_percent,
    NULL::numeric AS funny_percent,
    NULL::numeric AS happy_percent,
    NULL::numeric AS shocked_percent,
    NULL::numeric AS sad_percent,
    NULL::numeric AS boring_percent,
    NULL::numeric AS angry_percent,
    NULL::numeric AS like_score;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    art_id uuid,
    art_type character varying,
    text text,
    anonymous boolean,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    interactions_count integer DEFAULT 0
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_name character varying NOT NULL,
    crypted_password character varying,
    password_salt character varying,
    persistence_token character varying,
    age_range smallint,
    latitude double precision,
    longitude double precision,
    avatar character varying,
    gender smallint,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    email character varying
);


--
-- Name: votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.votes (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    comment_id uuid,
    vote_type character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: ar_internal_metadata ar_internal_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ar_internal_metadata
    ADD CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: comment_interactions comment_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_interactions
    ADD CONSTRAINT comment_interactions_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: votes votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT votes_pkey PRIMARY KEY (id);


--
-- Name: index_comment_interactions_on_user_id_and_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comment_interactions_on_user_id_and_comment_id ON public.comment_interactions USING btree (user_id, comment_id);


--
-- Name: index_comments_on_art_id_and_art_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_art_id_and_art_type ON public.comments USING btree (art_id, art_type);


--
-- Name: index_comments_on_interactions_count; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_interactions_count ON public.comments USING btree (interactions_count);


--
-- Name: index_comments_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_comments_on_user_id ON public.comments USING btree (user_id);


--
-- Name: index_users_on_age_range; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_age_range ON public.users USING btree (age_range);


--
-- Name: index_users_on_gender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_gender ON public.users USING btree (gender);


--
-- Name: index_users_on_latitude_and_longitude; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_users_on_latitude_and_longitude ON public.users USING btree (latitude, longitude);


--
-- Name: index_users_on_user_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX index_users_on_user_name ON public.users USING btree (user_name);


--
-- Name: index_votes_on_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_votes_on_comment_id ON public.votes USING btree (comment_id);


--
-- Name: index_votes_on_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX index_votes_on_user_id ON public.votes USING btree (user_id);


--
-- Name: comment_vote_tabulations _RETURN; Type: RULE; Schema: public; Owner: -
--

CREATE OR REPLACE VIEW public.comment_vote_tabulations AS
 SELECT comments.id,
    comments.user_id,
    comments.art_id,
    comments.art_type,
    comments.text,
    comments.anonymous,
    comments.created_at,
    comments.updated_at,
    comments.interactions_count,
    char_length(comments.text) AS comment_length,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'top'::text) THEN 1
            ELSE 0
        END) AS top_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'love'::text) THEN 1
            ELSE 0
        END) AS love_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
            ELSE 0
        END) AS like_a_lot_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
            ELSE 0
        END) AS like_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
            ELSE 0
        END) AS indifferent_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
            ELSE 0
        END) AS dislike_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
            ELSE 0
        END) AS dislike_a_lot_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'trash'::text) THEN 1
            ELSE 0
        END) AS trash_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'warn'::text) THEN 1
            ELSE 0
        END) AS warn_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'smart'::text) THEN 1
            ELSE 0
        END) AS smart_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'funny'::text) THEN 1
            ELSE 0
        END) AS funny_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'happy'::text) THEN 1
            ELSE 0
        END) AS happy_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'shocked'::text) THEN 1
            ELSE 0
        END) AS shocked_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'sad'::text) THEN 1
            ELSE 0
        END) AS sad_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'boring'::text) THEN 1
            ELSE 0
        END) AS boring_count,
    sum(
        CASE
            WHEN ((votes.vote_type)::text = 'angry'::text) THEN 1
            ELSE 0
        END) AS angry_count,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'top'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS top_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'love'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS love_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS like_a_lot_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS like_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS indifferent_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS dislike_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS dislike_a_lot_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'trash'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS trash_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'warn'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS warn_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'smart'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS smart_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'funny'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS funny_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'happy'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS happy_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'shocked'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS shocked_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'sad'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS sad_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'boring'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS boring_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'angry'::text) THEN 1
                ELSE 0
            END))::numeric / (comments.interactions_count)::numeric)
            ELSE (0)::numeric
        END AS angry_percent,
        CASE
            WHEN (comments.interactions_count > 0) THEN (((((((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'like_a_lot'::text) THEN 1
                ELSE 0
            END))::numeric * (2)::numeric) + ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'like'::text) THEN 1
                ELSE 0
            END))::numeric * (1)::numeric)) + ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'indifferent'::text) THEN 1
                ELSE 0
            END))::numeric * (0)::numeric)) - ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'dislike'::text) THEN 1
                ELSE 0
            END))::numeric * 0.5)) - ((sum(
            CASE
                WHEN ((votes.vote_type)::text = 'dislike_a_lot'::text) THEN 1
                ELSE 0
            END))::numeric * (1)::numeric)) / ((2 * comments.interactions_count))::numeric)
            ELSE (0)::numeric
        END AS like_score
   FROM (public.comments
     LEFT JOIN public.votes ON ((votes.comment_id = comments.id)))
  GROUP BY comments.id;


--
-- PostgreSQL database dump complete
--

SET search_path TO "$user", public;

INSERT INTO "schema_migrations" (version) VALUES
('20181010153057'),
('20181010160156'),
('20181011144918'),
('20181011151242'),
('20181011180532'),
('20181015164745'),
('20181018140244'),
('20181024140611'),
('20181025163142');


