FROM python:3.13.1-slim-bookworm AS python-base

# Python ENV vars, valid in all images that use 'FROM python-base'
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=on \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_NO_INTERACTION=1 \
    DEBIAN_FRONTEND=noninteractive \
    SETUP_PATH=/opt \
    POETRY_VIRTUALENVS_CREATE=false \
    TZ=Europe/Zurich \
    LANG=C.UTF-8

# Based on the ones above
ENV VIRTUAL_ENV=$SETUP_PATH/venv \
    PATH=$SETUP_PATH/venv/bin:$PATH

# Merge build env and prod for now
RUN apt-get update && \
    apt-get install -y wget unzip python3-pip vim curl && \
    apt-get install -y chromium && \
    apt-get install -y build-essential git pkg-config libpq-dev rsync

RUN apt-get remove -y chromium

# Clean cache
RUN apt-get clean

# Copy needed files
COPY install_uc.sh poetry.lock pyproject.toml README.md /crawler/
COPY ./crawler/ /crawler/crawler/
COPY ./database_processing/ /crawler/database_processing/

WORKDIR /crawler/

RUN pip install poetry && poetry install && \
    poetry cache clear --all -n . && \
    rm -rf /root/.cache

FROM python-base AS production

WORKDIR /crawler/

RUN wget https://sybilmail.de/files/cookieblock/profile_consentomatic_accept_all.tar.gz
RUN wget https://sybilmail.de/files/cookieblock/profile_consentomatic_accept_none.tar.gz
RUN wget https://sybilmail.de/files/cookieblock/profile_consentomatic_without_consentomatic.tar.gz

RUN ./install_uc.sh
