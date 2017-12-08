import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import mockTask = require('vsts-task-lib/mock-task');

const taskPath = path.join(__dirname, '..', 'jenkinsdownloadartifacts.js');
const tr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tr.setInput("serverEndpoint", "ID1");
tr.setInput("jobName", "folder1/folder2/testmultibranchproject")
tr.setInput("saveTo", "jenkinsArtifacts");
tr.setInput("filePath", "/");
tr.setInput("jenkinsBuild", "BuildNumber");
tr.setInput("jenkinsBuildNumber", "master/20");
tr.setInput("itemPattern", "**");
tr.setInput("downloadCommitsAndWorkItems", "true");

process.env['ENDPOINT_URL_ID1'] = 'http://url';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_username'] = 'dummyusername';
process.env['ENDPOINT_AUTH_PARAMETER_connection1_password'] = 'dummypassword';
process.env['ENDPOINT_DATA_ID1_acceptUntrustedCerts'] = 'true';

tr.registerMock("artifact-engine/Engine" , { 
    ArtifactEngine: function() {
        return { 
            processItems: function(A,B,C) {},
        }
    },
    ArtifactEngineOptions: function() {
    }
});

tr.registerMock("request", {
    get: function(urlObject, callback) {
        console.log(`Mock invoked for ${urlObject.url}`)

        if (urlObject.url === "http://url/job/folder1/job/folder2/job/testmultibranchproject//api/json") {
            callback(0, {statusCode: 200}, '{ "_class": "org.jenkinsci.plugins.workflow.multibranch.WorkflowMultiBranchProject" }');
        }

        return {auth: function(A,B,C) {}}
    }
});

tr.run();
