OpenWPM
---------

OpenWPM is a web privacy measurement framework which makes it easy to
collect data for privacy studies on a scale of thousands to millions
of websites. OpenWPM is built on top of Firefox, with automation provided
by Selenium. It includes several hooks for data collection. Check out
the instrumentation section below for more details.

The original publication on OpenWPM can be found here: [publication](http://randomwalker.info/publications/OpenWPM_1_million_site_tracking_measurement.pdf)

The official OpenWPM github repository is found at: https://github.com/mozilla/OpenWPM

Installation
------------

OpenWPM is tested on Ubuntu 18.04 via TravisCI and is commonly used via the docker container
that this repo builds, which is also based on Ubuntu. Although we don't officially support
other platforms, conda is a cross platform utility and the install script can be expected
to work on OSX and other linux distributions.

OpenWPM does not support windows: https://github.com/mozilla/OpenWPM/issues/503


### Pre-requisites

The main pre-requisite for OpenWPM is conda, a cross-platform package management tool.

Conda is open-source, and can be installed from https://docs.conda.io/en/latest/miniconda.html.

### Install

An installation script, `install.sh` is included to: install the conda environment,
install unbranded firefox, and build the instrumentation extension.

All installation is confined to your conda environment and should not affect your machine.
The installation script will, however, override any existing conda environment named openwpm.

To run the install script, run

    $ ./install.sh

After running the install script, activate your conda environment by running:

    $ conda activate openwpm

### Developer instructions

Dev dependencies are installed by using the main `environment.yaml` (which
is used by `./install.sh` script).

You can install pre-commit hooks install the hooks by running `pre-commit install` to
lint all the changes before you make a commit.

### Troubleshooting

1. `make` / `gcc` may need to be installed in order to build the web extension.
   On Ubuntu, this is achieved with `apt-get install make`. On OSX the necessary
   packages are part of xcode: `xcode-select --install`.
2. On a very sparse operating system additional dependencies may need to be
   installed. See the [Dockerfile](Dockerfile) for more inspiration, or open
   an issue if you are still having problems.
3. If you see errors related to incompatible or non-existing python packages,
   try re-running the file with the environment variable
   `PYTHONNOUSERSITE` set. E.g., `PYTHONNOUSERSITE=True python demo.py`.
   If that fixes your issues, you are experiencing
   [issue 689](https://github.com/mozilla/OpenWPM/issues/689), which can be
   fixed by clearing your
   python [user site packages directory](https://www.python.org/dev/peps/pep-0370/),
   by prepending `PYTHONNOUSERSITE=True` to a specific command, or by setting
   the environment variable for the session (e.g., `export PYTHONNOUSERSITE=True`
   in bash). Please also add a comment to that issue to let us know you ran
   into this problem.

License
-------

The additions made to this framework (instrumentation, crawling scripts) are licensed under GNU GPLv3.

OpenWPM is licensed under GNU GPLv3, see [license](LICENSE). Additional code has been included from
[FourthParty](https://github.com/fourthparty/fourthparty) and
[Privacy Badger](https://github.com/EFForg/privacybadgerfirefox), both of which
are licensed GPLv3+.

