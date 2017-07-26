var path = require("path");
var webpack = require("webpack");

module.exports = {
    target: "web",
    entry: {
        WidgetRollUpBoard: "./scripts/WidgetRollUpBoard.ts",
        configuration: "./scripts/configuration.ts",
        rollupboard: "./scripts/RollUpBoard.ts",
        launchDarklyService: "./scripts/launchdarkly.service.ts"
    },
    output: {
        filename: "[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: [
            "",
            ".webpack.js",
            ".web.js",
            ".ts",
            ".tsx",
            ".js"],
        root: [
            path.resolve("./scripts")
        ]
    },
    module: {
        preLoaders: [
            {
                test: /\.tsx?$/,
                loader: "tslint"
            }
        ],
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.s?css$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.json?$/,
                loader: "json-loader"
            }
        ]
    },
    tslint: {
        emitErrors: true,
        failOnHint: true
    }
}