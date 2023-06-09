/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


package org.gradle.api.plugins.quality.internal

import org.gradle.api.Action
import org.gradle.api.GradleException
import org.gradle.api.file.FileCollection
import org.gradle.api.internal.project.ant.AntLoggingAdapter
import org.gradle.api.internal.project.antbuilder.AntBuilderDelegate
import org.gradle.internal.logging.ConsoleRenderer
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class CodeNarcInvoker implements Action<AntBuilderDelegate> {

    private static final Logger LOGGER = LoggerFactory.getLogger(CodeNarcInvoker.class);

    private final CodeNarcActionParameters parameters

    CodeNarcInvoker(CodeNarcActionParameters parameters) {
        this.parameters = parameters
    }

    void execute(AntBuilderDelegate ant) {
        def compilationClasspath = parameters.compilationClasspath
        def configFile = parameters.config.get()
        def maxPriority1Violations = parameters.maxPriority1Violations.get()
        def maxPriority2Violations = parameters.maxPriority2Violations.get()
        def maxPriority3Violations = parameters.maxPriority3Violations.get()
        def reports = parameters.enabledReports.get()
        def ignoreFailures = parameters.ignoreFailures.get()
        def source = parameters.source

        ant.taskdef(name: 'codenarc', classname: 'org.codenarc.ant.CodeNarcTask')
        try {
            ant.codenarc(ruleSetFiles: "file:${configFile}", maxPriority1Violations: maxPriority1Violations, maxPriority2Violations: maxPriority2Violations, maxPriority3Violations: maxPriority3Violations) {
                reports.each {  r ->
                    // See http://codenarc.sourceforge.net/codenarc-TextReportWriter.html
                    if (r.name.get() == 'console') {
                        setLifecycleLogLevel(ant, 'INFO')
                        report(type: 'text') {
                            option(name: 'writeToStandardOut', value: true)
                        }
                    } else {
                        setLifecycleLogLevel(ant, null)
                        report(type: r.name.get()) {
                            option(name: 'outputFile', value: r.outputLocation.asFile.get())
                        }
                    }
                }

                source.addToAntBuilder(ant, 'fileset', FileCollection.AntType.FileSet)

                if (!compilationClasspath.empty) {
                    compilationClasspath.addToAntBuilder(ant, 'classpath')
                }
            }
        } catch (Exception e) {
            if (e.message.matches('Exceeded maximum number of priority \\d* violations.*')) {
                def message = "CodeNarc rule violations were found."
                def report = reports.isEmpty() ? null : reports.get(0)
                if (report && report.name.get() != 'console') {
                    def reportUrl = new ConsoleRenderer().asClickableFileUrl(report.outputLocation.asFile.get())
                    message += " See the report at: $reportUrl"
                }
                if (ignoreFailures) {
                    LOGGER.warn(message)
                    return
                }
                throw new GradleException(message, e)
            }
            if (e.message == /codenarc doesn't support the nested "classpath" element./) {
                def message = "The compilationClasspath property of CodeNarc task can only be non-empty when using CodeNarc 0.27.0 or newer."
                throw new GradleException(message, e)
            }
            throw e
        }
    }

    static void setLifecycleLogLevel(AntBuilderDelegate ant, String lifecycleLogLevel) {
        ant?.builder?.project?.buildListeners?.each {
            // We cannot use instanceof or getClass()==AntLoggingAdapter since they're in different class loaders
            if (it.class.name == AntLoggingAdapter.name) {
                it.lifecycleLogLevel = lifecycleLogLevel
            }
        }
    }
}
