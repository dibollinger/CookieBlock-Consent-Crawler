
# This file has been altered from its original release

from ..Errors import CommandExecutionError
from . import browser_commands, profile_commands, cmp_scrape_commands
from .Types import (BrowseCommand, DumpPageSourceCommand, DumpProfCommand,
                    FinalizeCommand, GetCommand, InitializeCommand,
                    RecursiveDumpPageSourceCommand, RunCustomFunctionCommand,
                    SaveScreenshotCommand, ScreenshotFullPageCommand,
                    CookiebotScrapeCommand, OneTrustScrapeCommand,
                    TermlyScrapeCommand, GenericCMPScrapeCommand)

from selenium.webdriver.remote.webdriver import WebDriver


def execute_command(command, webdriver: WebDriver, browser_settings, browser_params,
                    manager_params, extension_socket):
    """Executes BrowserManager commands
    commands are of form (COMMAND, ARG0, ARG1, ...)
    """
    if type(command) is GetCommand:
        browser_commands.get_website(
            url=command.url, sleep=command.sleep, visit_id=command.visit_id,
            webdriver=webdriver, browser_params=browser_params,
            extension_socket=extension_socket)

    elif type(command) is BrowseCommand:
        browser_commands.browse_website(
            url=command.url, num_links=command.num_links,
            sleep=command.sleep, subpage_timeout=command.subpage_timeout,
            visit_id=command.visit_id, webdriver=webdriver,
            browser_params=browser_params, manager_params=manager_params,
            extension_socket=extension_socket)

    elif type(command) is DumpProfCommand:
        profile_commands.dump_profile(
            browser_profile_folder=browser_params['profile_path'],
            manager_params=manager_params,
            browser_params=browser_params,
            tar_location=command.dump_folder,
            close_webdriver=command.close_webdriver,
            webdriver=webdriver, browser_settings=browser_settings,
            compress=command.compress)

    elif type(command) is DumpPageSourceCommand:
        browser_commands.dump_page_source(
            visit_id=command.visit_id, driver=webdriver,
            manager_params=manager_params, suffix=command.suffix)

    elif type(command) is RecursiveDumpPageSourceCommand:
        browser_commands.recursive_dump_page_source(
            visit_id=command.visit_id, driver=webdriver,
            manager_params=manager_params, suffix=command.suffix)

    elif type(command) is SaveScreenshotCommand:
        browser_commands.save_screenshot(
            visit_id=command.visit_id, browser_id=command.browser_id,
            driver=webdriver, manager_params=manager_params,
            suffix=command.suffix)

    elif type(command) is ScreenshotFullPageCommand:
        browser_commands.screenshot_full_page(
            visit_id=command.visit_id, browser_id=command.browser_id,
            driver=webdriver, manager_params=manager_params,
            suffix=command.suffix)

    elif type(command) is CookiebotScrapeCommand:
        cmp_scrape_commands.run_cookiebot_scrape(
            visit_id=command.visit_id, browser_id=command.browser_id,
            url=command.url, sleep=command.sleep,
            webdriver=webdriver, browser_params=browser_params,
            manager_params=manager_params, extension_socket=extension_socket
        )

    elif type(command) is OneTrustScrapeCommand:
        cmp_scrape_commands.run_onetrust_scrape(
            visit_id=command.visit_id, browser_id=command.browser_id,
            url=command.url, sleep=command.sleep,
            webdriver=webdriver, browser_params=browser_params,
            manager_params=manager_params, extension_socket=extension_socket
        )

    elif type(command) is TermlyScrapeCommand:
        cmp_scrape_commands.run_termly_scrape(
            visit_id=command.visit_id, browser_id=command.browser_id,
            url=command.url, sleep=command.sleep,
            webdriver=webdriver, browser_params=browser_params,
            manager_params=manager_params, extension_socket=extension_socket
        )

    elif type(command) is GenericCMPScrapeCommand:
        cmp_scrape_commands.run_generic_scrape(
            visit_id=command.visit_id, browser_id=command.browser_id,
            url=command.url, abort_early=command.abort_browse_early,
            num_links=command.num_links, subpage_timeout=command.subpage_timeout,
            sleep=command.sleep, webdriver=webdriver, browser_params=browser_params,
            manager_params=manager_params, extension_socket=extension_socket
        )

    elif type(command) is RunCustomFunctionCommand:
        arg_dict = {"command": command,
                    "driver": webdriver,
                    "browser_settings": browser_settings,
                    "browser_params": browser_params,
                    "manager_params": manager_params,
                    "extension_socket": extension_socket}
        command.function_handle(*command.func_args, **arg_dict)

    elif type(command) is FinalizeCommand:
        browser_commands.finalize(
            visit_id=command.visit_id, sleep=command.sleep,
            webdriver=webdriver, extension_socket=extension_socket)

    elif type(command) is InitializeCommand:
        browser_commands.initialize(
            visit_id=command.visit_id,
            extension_socket=extension_socket)

    else:
        raise CommandExecutionError("Invalid Command", command)
