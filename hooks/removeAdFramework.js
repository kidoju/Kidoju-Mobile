// This Cordova Hook (script) removes "AdSupport.framework" and "libAdIdAccess" references
// from the cordova-plugin-google-analytics plugin, as well as removes it from
// references found in the corresponding node_module and .project.pbxproj.
// The authoritative source is found at:
// https://gist.githubusercontent.com/SteveKennedy/7edbe6e5f54d8582a27acbfd8d704c12/raw/654a2104cb230b97118f18ed273183c61f885401/removeAdFramework.js

module.exports = ctx => {
    // Reference Dependencies
    const fs = ctx.requireCordovaModule('fs');
    const path = ctx.requireCordovaModule('path');
    const q = ctx.requireCordovaModule('q');

    /**
     * removeAdReferencesFrom
     * @param filePath
     */
    function removeAdReferencesFrom(filePath) {
        const deferred = q.defer();

        // Only Do This Only If Plugin.XML is found for this plugin.
        fs.stat(filePath, (error /* , stats */) => {
            if (error) {
                deferred.reject(error);
            } else {
                // Read In That Plugin.XML File
                const data = fs.readFileSync(filePath, 'utf8');

                // Split the Contents of That File Into An Array Of Lines
                const dataArray = data.split('\n');

                // Define Substrings To Eliminate if contained within Each Line
                const frameworkString = 'AdSupport.framework';
                const sourceFileString = 'libAdIdAccess';

                // Store original length of Array for comparison later
                const originalDataArrayLength = dataArray.length;

                // Loop Through The Lines and Remove the Line/Item if it contains The Substrings
                for (let i = dataArray.length - 1; i >= 0; i--) {
                    if (
                        dataArray[i].indexOf(sourceFileString) !== -1 ||
                        dataArray[i].indexOf(frameworkString) !== -1
                    ) {
                        // eslint-disable-next-line no-console
                        console.log(
                            `Removing line ${i} from ${filePath}:\n${dataArray[
                                i
                            ].trim()}`
                        );
                        dataArray.splice(i, 1);
                    }
                }

                // If Nothing Was Found/Removed/Spliced, No Need To Overwrite.
                if (originalDataArrayLength === dataArray.length) {
                    console.log(`No Changes to File: ${filePath}`); // eslint-disable-line no-console
                } else {
                    // Rejoin the Array Into A String
                    const newData = dataArray.join('\r\n');

                    // Overwrite the File with Modified Contents
                    fs.writeFileSync(filePath, newData, 'utf8');
                }
                deferred.resolve();
            }
        });

        return deferred.promise;
    }

    /**
     * getIOSProjectPath
     * @returns {string}
     */
    function getIOSProjectPath() {
        const common = ctx.requireCordovaModule('cordova-common');
        const util = ctx.requireCordovaModule('cordova-lib/src/cordova/util');

        const projectName = new common.ConfigParser(
            util.projectConfig(util.isCordova())
        ).name();
        const projectPath = `./platforms/ios/${projectName}.xcodeproj/project.pbxproj`;
        return projectPath;
    }

    /**
     * Remove Ad (IDFA) References from project
     * @type {string}
     */
    const pluginName = 'cordova-plugin-google-analytics';

    // debugger;
    console.log('Attempting To Remove Ad (IDFA) References from project...'); // eslint-disable-line no-console

    // Define Path to Plugin.XML of cordova-plugin-google-analytics
    const pluginFilePath = path.join(
        ctx.opts.projectRoot,
        `plugins/${pluginName}/plugin.xml`
    );
    const nodeModulesPath = path.join(
        ctx.opts.projectRoot,
        `node_modules/${pluginName}/plugin.xml`
    );
    const pbxprojFilePath = getIOSProjectPath();

    // Remove Ad (IDFA) References from all 3 files
    return q.all([
        removeAdReferencesFrom(pluginFilePath),
        removeAdReferencesFrom(pbxprojFilePath),
        removeAdReferencesFrom(nodeModulesPath)
    ]);
};
