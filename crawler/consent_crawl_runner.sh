#!/bin/bash

# Default values
url_file=""
launch_browser=false
url=""
resume=false
num_browsers=1
batch_size=-1
use_db=""
profile_tar=""
no_headless=false
no_stdout=false
num_subpages=10
timeout=600

# Print all arguments
echo "Arguments: $@"

# Function to display usage and exit
usage() {
  echo "Usage: $0 [OPTIONS]"
  echo "Options:"
  echo "  -f, --file <file>               Path to file containing one URL per line"
  echo "  --launch-browser                Only launches the browser which allows modification of the current profile"
  echo "  -u, --url <url>                 Url to crawl once"
  echo "  --resume                        Resume crawl in given database."
  echo "  -n, --num-browsers <num>        Number of browsers to use in parallel (default: 1)"
  echo "  --batch-size <size>             Number of websites to process in a batch (default: -1)"
  echo "  -d, --use-db <db>               Use specified database file to add rows to. Format: DATA_PATH/FILENAME.sqlite"
  echo "  --profile_tar <tar>             Location of a tar file containing the browser profile"
  echo "  --no-headless                   Start the browser with GUI (headless disabled)"
  echo "  --no-stdout                     Do not print crawl results to stdout"
  echo "  --num-subpages <num>            Amount of links to follow when visiting a domain (default: 10)"
  echo "  --timeout <seconds>             Amount of seconds to spend on one website (default: 600)"
  exit 1
}

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -f|--file)
      url_file="$2"
      shift
      ;;
    --launch-browser)
      launch_browser=true
      ;;
    -u|--url)
      url="$2"
      shift
      ;;
    --resume)
      resume=true
      ;;
    -n|--num-browsers)
      num_browsers="$2"
      shift
      ;;
    --batch-size)
      batch_size="$2"
      shift
      ;;
    -d|--use-db)
      use_db="$2"
      shift
      ;;
    --profile-tar)
      profile_tar="$2"
      shift
      ;;
    --no-headless)
      no_headless=true
      ;;
    --no-stdout)
      no_stdout=true
      ;;
    --num-subpages)
      num_subpages="$2"
      shift
      ;;
    --timeout)
      timeout="$2"
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      usage
      ;;
  esac
  shift
done

# Mutually exclusive group check
if [[ -n "$url_file" && ($launch_browser == true || -n "$url" || $resume == true) ]]; then
  echo "Error: -f/--file is mutually exclusive with --launch-browser, -u/--url, and --resume."
  usage
elif [[ $launch_browser == true && (-n "$url_file" || -n "$url" || $resume == true) ]]; then
  echo "Error: --launch-browser is mutually exclusive with -f/--file, -u/--url, and --resume."
  usage
elif [[ -n "$url" && (-n "$url_file" || $launch_browser == true || $resume == true) ]]; then
  echo "Error: -u/--url is mutually exclusive with -f/--file, --launch-browser, and --resume."
  usage
elif [[ $resume == true && (-n "$url_file" || $launch_browser == true || -n "$url") ]]; then
  echo "Error: --resume is mutually exclusive with -f/--file, --launch-browser, and -u/--url."
  usage
elif [[ -z "$url_file" && $launch_browser == false && -z "$url" && $resume == false ]]; then
  echo "Error: One of -f/--file, --launch-browser, -u/--url, or --resume is required."
  usage
fi

# Function to kill all chrome processes
kill_chrome_processes() {
    pkill -f chrome

    # Check for zombie chrome processes
    zombie_count=$(ps aux | grep '[c]hrome' | awk '{ if ($8 == "Z") print $0 }' | wc -l)
    echo "Number of zombie chrome processes: $zombie_count"
}

# If batch-size is provided, compute number of batches
if [[ $batch_size -gt 0 ]]; then
    if [[ -z $url_file ]]; then
        echo "Error: URL file not specified. Use -f or --file to specify the file."
        exit 1
    fi
    total_urls=$(wc -l < "$url_file")
    num_batches=$(( (total_urls + batch_size - 1) / batch_size ))
    echo "Total URLs: $total_urls, Batch size: $batch_size, Number of batches: $num_batches"

    # If no DB argument is provided, generate a new DB name
    if [[ -z $use_db ]]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        use_db="./collected_data/crawl_data_${timestamp}.sqlite"
    fi
else
    num_batches=1
fi

# Print updated arguments
# Example usage of parsed arguments
echo "File: $url_file"
echo "Launch Browser: $launch_browser"
echo "URL: $url"
echo "Resume: $resume"
echo "Num Browsers: $num_browsers"
echo "Batch Size: $batch_size"
echo "Use DB: $use_db"
echo "Profile Tar: $profile_tar"
echo "No Headless: $no_headless"
echo "No Stdout: $no_stdout"
echo "Num Subpages: $num_subpages"
echo "Timeout: $timeout"

args_command="--num-browsers $num_browsers --batch-size $batch_size --use-db $use_db --profile-tar $profile_tar --num-subpages $num_subpages --timeout $timeout"
if [[ $no_headless == true ]]; then
    args_command+=" --no-headless"
fi
if [[ $no_stdout == true ]]; then
    args_command+=" --no-stdout"
fi

# Run the script in batches
for ((i=1; i<=num_batches; i++)); do
    echo "Running batch $i of $num_batches"
    if [[ $i -eq 1 ]]; then
        if [[ $url_file ]]; then
            echo "python ./crawler/run_consent_crawl_uc.py $args_command  --file $url_file"
            python ./crawler/run_consent_crawl_uc.py $args_command --file $url_file
        else
            echo "python ./crawler/run_consent_crawl_uc.py $args_command --url $url"
            python ./crawler/run_consent_crawl_uc.py $args_command --url $url
        fi
    else
        offset=$(( (i-1) * batch_size ))
        echo "python ./crawler/run_consent_crawl_uc.py $args_command --resume --offset $offset"
        python ./crawler/run_consent_crawl_uc.py $args_command --resume --offset $offset
    fi

    exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        echo "Iteration $i failed with exit code $exit_code. Stopping."
        exit $exit_code
    fi

    # Kill all chrome processes after each iteration
    kill_chrome_processes
done
