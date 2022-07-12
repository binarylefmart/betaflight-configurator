import { i18n } from '../localization';

const options = {};
options.initialize = function (callback) {
    if (GUI.active_tab !== 'options') {
        GUI.active_tab = 'options';
    }

    $('#content').load("./tabs/options.html", function () {
        i18n.localizePage();

        TABS.options.initPermanentExpertMode();
        TABS.options.initRememberLastTab();
        TABS.options.initCheckForConfiguratorUnstableVersions();
        TABS.options.initAnalyticsOptOut();
        TABS.options.initCliAutoComplete();
        TABS.options.initShowAllSerialDevices();
        TABS.options.initShowVirtualMode();
        TABS.options.initCordovaForceComputerUI();
        TABS.options.initDarkTheme();

        TABS.options.initShowWarnings();

        GUI.content_ready(callback);
    });
};

options.cleanup = function (callback) {
    if (callback) {
        callback();
    }
};

options.initShowWarnings = function () {
    const result = ConfigStorage.get('showPresetsWarningBackup');
    if (result.showPresetsWarningBackup) {
        $('div.presetsWarningBackup input').prop('checked', true);
    }

    $('div.presetsWarningBackup input').change(function () {
        const checked = $(this).is(':checked');
        ConfigStorage.set({'showPresetsWarningBackup': checked});
    }).change();
};

options.initPermanentExpertMode = function () {
    const result = ConfigStorage.get('permanentExpertMode');
    if (result.permanentExpertMode) {
        $('div.permanentExpertMode input').prop('checked', true);
    }

    $('div.permanentExpertMode input').change(function () {
        const checked = $(this).is(':checked');

        ConfigStorage.set({'permanentExpertMode': checked});

        $('input[name="expertModeCheckbox"]').prop('checked', checked).change();
    }).change();
};

options.initRememberLastTab = function () {
    const result = ConfigStorage.get('rememberLastTab');
    $('div.rememberLastTab input')
        .prop('checked', !!result.rememberLastTab)
        .change(function() { ConfigStorage.set({rememberLastTab: $(this).is(':checked')}); })
        .change();
};

options.initCheckForConfiguratorUnstableVersions = function () {
    const result = ConfigStorage.get('checkForConfiguratorUnstableVersions');
    if (result.checkForConfiguratorUnstableVersions) {
        $('div.checkForConfiguratorUnstableVersions input').prop('checked', true);
    }

    $('div.checkForConfiguratorUnstableVersions input').change(function () {
        const checked = $(this).is(':checked');

        ConfigStorage.set({'checkForConfiguratorUnstableVersions': checked});

        checkForConfiguratorUpdates();
    });
};

options.initAnalyticsOptOut = function () {
    const result = ConfigStorage.get('analyticsOptOut');
    if (result.analyticsOptOut) {
        $('div.analyticsOptOut input').prop('checked', true);
    }

    $('div.analyticsOptOut input').change(function () {
        const checked = $(this).is(':checked');

        ConfigStorage.set({'analyticsOptOut': checked});

        checkSetupAnalytics(function (analyticsService) {
            if (checked) {
                analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'OptOut');
            }

            analyticsService.setOptOut(checked);

            if (!checked) {
                analyticsService.sendEvent(analyticsService.EVENT_CATEGORIES.APPLICATION, 'OptIn');
            }
        });
    }).change();
};

options.initCliAutoComplete = function () {
    $('div.cliAutoComplete input')
        .prop('checked', CliAutoComplete.configEnabled)
        .change(function () {
            const checked = $(this).is(':checked');

            ConfigStorage.set({'cliAutoComplete': checked});
            CliAutoComplete.setEnabled(checked);
        }).change();
};

options.initAutoConnectConnectionTimeout = function () {
    const result = ConfigStorage.get('connectionTimeout');
    if (result.connectionTimeout) {
        $('#connectionTimeoutSelect').val(result.connectionTimeout);
    }
    $('#connectionTimeoutSelect').on('change', function () {
        const value = parseInt($(this).val());
        ConfigStorage.set({'connectionTimeout': value});
    });
};

options.initShowAllSerialDevices = function() {
    const showAllSerialDevicesElement = $('div.showAllSerialDevices input');
    const result = ConfigStorage.get('showAllSerialDevices');
    showAllSerialDevicesElement
        .prop('checked', !!result.showAllSerialDevices)
        .on('change', () => ConfigStorage.set({ showAllSerialDevices: showAllSerialDevicesElement.is(':checked') }))
        .trigger('change');
};

options.initShowVirtualMode = function() {
    const showVirtualModeElement = $('div.showVirtualMode input');
    const result = ConfigStorage.get('showVirtualMode');
    showVirtualModeElement
        .prop('checked', !!result.showVirtualMode)
        .on('change', () => {
            ConfigStorage.set({ showVirtualMode: showVirtualModeElement.is(':checked') });
            PortHandler.initialPorts = false;
        })
        .trigger('change');
};

options.initCordovaForceComputerUI = function () {
    if (GUI.isCordova() && cordovaUI.canChangeUI) {
        const result = ConfigStorage.get('cordovaForceComputerUI');
        if (result.cordovaForceComputerUI) {
            $('div.cordovaForceComputerUI input').prop('checked', true);
        }

        $('div.cordovaForceComputerUI input').change(function () {
            const checked = $(this).is(':checked');

            ConfigStorage.set({'cordovaForceComputerUI': checked});

            if (typeof cordovaUI.set === 'function') {
                cordovaUI.set();
            }
        });
    } else {
        $('div.cordovaForceComputerUI').hide();
    }
};

options.initDarkTheme = function () {
    $('#darkThemeSelect')
        .val(DarkTheme.configEnabled)
        .change(function () {
            const value = parseInt($(this).val());

            ConfigStorage.set({'darkTheme': value});
            setDarkTheme(value);
        }).change();
};

// TODO: remove when modules are in place
window.TABS.options = options;
export { options };
