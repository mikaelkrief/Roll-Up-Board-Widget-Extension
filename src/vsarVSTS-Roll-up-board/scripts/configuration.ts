// ---------------------------------------------------------------------
// <copyright file="configuration.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// </summary>
// ---------------------------------------------------------------------

/// <reference types="vss-web-extension-sdk" />
/// <reference path="isettings.d.ts" />
"use strict";
import RestClient = require("TFS/Work/RestClient");
import CoreClient = require("TFS/Core/RestClient");
import CoreContracts = require("TFS/Core/Contracts");
import WorkContracts = require("TFS/Work/Contracts");
import Q = require("q");
import Context = require("VSS/Context");

import * as telemclient from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");
import * as ldservice from "./launchdarkly.service";
export class Configuration {
    widgetConfigurationContext = null;

    $select = $("#board-dropdown");
    $enableff = $("#enableff");
    $hidenewdone = $("#select-results");
    public client = RestClient.getClient();
    public _widgetHelpers;
    public LdclientServices: any;
    public showNewDone: boolean;
    public enableTelemetry = false;

    constructor(public WidgetHelpers, public ldclientServices) {
        this.LdclientServices = ldclientServices;
        this.showNewDone = this.ldclientServices.flags["show-newdone"];
        this.enableTelemetry = ldclientServices.flags["enable-telemetry"];

    }

    IsVSTS(): boolean {
        return Context.getPageContext().webAccessConfiguration.isHosted;
    }
    public load(widgetSettings, widgetConfigurationContext) {
        this.DisplayDemo();
        this.DisplayAreaPathDropdown();
        this.DisplayCheckboxHideNewDone();

        if (this.enableTelemetry) {
            telemclient.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("RollUpBoard.Configuration");
        }

        let _that = this;

        this.widgetConfigurationContext = widgetConfigurationContext;

        this.GetProjectTemplate().then(() => { });

        let $queryDropdown = document.getElementById("board-dropdown");
        let tc = <CoreContracts.TeamContext>{};
        tc.projectId = VSS.getWebContext().project.id;
        tc.teamId = VSS.getWebContext().team.id;
        this.PopulateBoardDropdown().then((boards) => {
            // console.log(boards);
            boards.forEach((board) => {

                let opt = document.createElement("option");
                let optText = document.createTextNode(board.name);
                opt.appendChild(optText);
                $queryDropdown.appendChild(opt);
            });

            _that.$select
                .change(() => {

                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                        _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
                });

            let $boardDropdown = $("#board-dropdown");
            let settings = JSON.parse(widgetSettings.customSettings.data);
            if (settings && settings.board) {
                $boardDropdown.val(settings.board);
            } else {
                // first load
                $boardDropdown.val("");
            }

            _that.$enableff.prop("checked", this.ldclientServices.flags["filter-areapath"]);
            _that.$enableff.change(() => {
                let enabledFeature = _that.$enableff.is(":checked");
                this.DisplayAreaPathDropdownClientSide(enabledFeature);
                this.SetEnableFF(enabledFeature, "filter-areapath").then((e) => {
                    if (e = "204") {
                        this.LdclientServices.UpdateFlag("filter-areapath", enabledFeature);
                        this.DisplayAreaPathDropdown();
                        this.LdclientServices.Trackevent("filter-areapath");
                    }
                });
            });

            return _that.WidgetHelpers.WidgetStatusHelper.Success();
        });
    }

    public PopulateBoardDropdown(): IPromise<WorkContracts.BoardReference[]> {
        let deferred = Q.defer<WorkContracts.BoardReference[]>();
        let tc = <CoreContracts.TeamContext>{};
        tc.projectId = VSS.getWebContext().project.id;
        tc.teamId = VSS.getWebContext().team.id;
        this.client.getBoards(tc).then((boards) => {
            // console.log(boards);
            deferred.resolve(boards);
        });
        return deferred.promise;
    }

    public GetProjectTemplate(): IPromise<string> {
        let deferred = Q.defer<string>();
        let client = CoreClient.getClient();
        client.getProject(VSS.getWebContext().project.id, true).then((q: CoreContracts.TeamProject) => {
            let processT = q.capabilities["processTemplate"];
            deferred.resolve(processT["templateName"]);
        });

        return deferred.promise;
    }
    private SetEnableFF(enabled: boolean, feature: string): Promise<string> {
        let deferred = Q.defer<string>();
        this.LdclientServices.UpdateUserFeature(this.LdclientServices.user, enabled, feature).then((r) => {
            console.log(r);
            deferred.resolve(r);
        });
        return deferred.promise;
    }

    public DisplayCheckboxHideNewDone() {
        if (this.ldclientServices.flags["show-newdone"]) {
            $("#select-results").show();
        } else {
            $("#select-results").hide();
        }
    }

    public DisplayAreaPathDropdown() {
        $("#area-path-dropdown").hide();
        console.log("filter-areapath: " + this.ldclientServices.flags["filter-areapath"]);
        if (this.ldclientServices.flags["filter-areapath"]) {
            $("#area-path-dropdown").show();
        } else {
            $("#area-path-dropdown").hide();
        }
    }
    public DisplayAreaPathDropdownClientSide(enable: boolean) {
        $("#area-path-dropdown").hide();
        if (enable) {
            $("#area-path-dropdown").show();
        } else {
            $("#area-path-dropdown").hide();
        }
    }
    public DisplayDemo() {
        $("#ff-demo").hide();
        console.log("demo: " + this.ldclientServices.flags["demo"]);
        if (this.ldclientServices.flags["demo"]) {
            $("#ff-demo").show();
        } else {
            $("#ff-demo").hide();
        }
    }

    public getCustomSettings() {
        let result = { data: JSON.stringify(<ISettings>{ board: $("#board-dropdown").val() }) };
        return result;
    }

    public onSave() {
        return this.WidgetHelpers.WidgetConfigurationSave.Valid(this.getCustomSettings());
    }

}