--
-- PostgreSQL database dump
--

\restrict t0nKRJrfVAWAkvfoTyeG3CEXhgeiNXoXnxWFkdeKDfhwwCP6aWdzujqRMkCJDWM

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: paquetes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paquetes (
    id integer NOT NULL,
    id_superheroe integer NOT NULL,
    nombre_paquete character varying(100) NOT NULL,
    descripcion text,
    precio integer NOT NULL,
    cupos_disponibles integer NOT NULL
);


ALTER TABLE public.paquetes OWNER TO postgres;

--
-- Name: paquetes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paquetes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paquetes_id_seq OWNER TO postgres;

--
-- Name: paquetes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paquetes_id_seq OWNED BY public.paquetes.id;


--
-- Name: perros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.perros (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_entrenador integer,
    nombre character varying(100) NOT NULL,
    edad integer,
    id_raza integer NOT NULL
);


ALTER TABLE public.perros OWNER TO postgres;

--
-- Name: perros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.perros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.perros_id_seq OWNER TO postgres;

--
-- Name: perros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.perros_id_seq OWNED BY public.perros.id;


--
-- Name: razas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.razas (
    id integer NOT NULL,
    nombre character varying(80) NOT NULL,
    tamanio character varying(50),
    temperamento character varying(100),
    fortaleza integer,
    velocidad integer,
    color_predominante character varying(80)
);


ALTER TABLE public.razas OWNER TO postgres;

--
-- Name: razas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.razas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.razas_id_seq OWNER TO postgres;

--
-- Name: razas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.razas_id_seq OWNED BY public.razas.id;


--
-- Name: resenas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resenas (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    id_superheroe integer NOT NULL,
    id_perro integer NOT NULL,
    calificacion integer NOT NULL,
    comentario character varying(200) NOT NULL,
    CONSTRAINT resenas_calificacion_check CHECK (((calificacion >= 1) AND (calificacion <= 5)))
);


ALTER TABLE public.resenas OWNER TO postgres;

--
-- Name: resenas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resenas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resenas_id_seq OWNER TO postgres;

--
-- Name: resenas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resenas_id_seq OWNED BY public.resenas.id;


--
-- Name: superheroes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.superheroes (
    id integer NOT NULL,
    nombre character varying(120) NOT NULL,
    franquicia character varying(100),
    experiencia integer NOT NULL,
    poderes text,
    paquetes_ofrecidos integer DEFAULT 0
);


ALTER TABLE public.superheroes OWNER TO postgres;

--
-- Name: superheroes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.superheroes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.superheroes_id_seq OWNER TO postgres;

--
-- Name: superheroes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.superheroes_id_seq OWNED BY public.superheroes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_perfil character varying(100) NOT NULL,
    "contraseña" character varying(200) NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    cantidad_perros integer DEFAULT 0,
    paquetes_comprados integer DEFAULT 0
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: paquetes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes ALTER COLUMN id SET DEFAULT nextval('public.paquetes_id_seq'::regclass);


--
-- Name: perros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perros ALTER COLUMN id SET DEFAULT nextval('public.perros_id_seq'::regclass);


--
-- Name: razas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.razas ALTER COLUMN id SET DEFAULT nextval('public.razas_id_seq'::regclass);


--
-- Name: resenas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas ALTER COLUMN id SET DEFAULT nextval('public.resenas_id_seq'::regclass);


--
-- Name: superheroes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superheroes ALTER COLUMN id SET DEFAULT nextval('public.superheroes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Name: paquetes paquetes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_pkey PRIMARY KEY (id);


--
-- Name: perros perros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perros
    ADD CONSTRAINT perros_pkey PRIMARY KEY (id);


--
-- Name: razas razas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.razas
    ADD CONSTRAINT razas_pkey PRIMARY KEY (id);


--
-- Name: resenas resenas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_pkey PRIMARY KEY (id);


--
-- Name: superheroes superheroes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.superheroes
    ADD CONSTRAINT superheroes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: paquetes paquetes_id_superheroe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paquetes
    ADD CONSTRAINT paquetes_id_superheroe_fkey FOREIGN KEY (id_superheroe) REFERENCES public.superheroes(id);


--
-- Name: perros perros_id_entrenador_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perros
    ADD CONSTRAINT perros_id_entrenador_fkey FOREIGN KEY (id_entrenador) REFERENCES public.superheroes(id);


--
-- Name: perros perros_id_raza_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perros
    ADD CONSTRAINT perros_id_raza_fkey FOREIGN KEY (id_raza) REFERENCES public.razas(id);


--
-- Name: perros perros_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.perros
    ADD CONSTRAINT perros_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- Name: resenas resenas_id_perro_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_id_perro_fkey FOREIGN KEY (id_perro) REFERENCES public.perros(id);


--
-- Name: resenas resenas_id_superheroe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_id_superheroe_fkey FOREIGN KEY (id_superheroe) REFERENCES public.superheroes(id);


--
-- Name: resenas resenas_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);


--
-- PostgreSQL database dump complete
--

\unrestrict t0nKRJrfVAWAkvfoTyeG3CEXhgeiNXoXnxWFkdeKDfhwwCP6aWdzujqRMkCJDWM

