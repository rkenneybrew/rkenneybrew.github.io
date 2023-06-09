/*
 * Copyright 2020 the original author or authors.
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

package org.gradle.jvm.toolchain.internal;

import org.gradle.api.internal.file.FileFactory;
import org.gradle.internal.jvm.inspection.JvmInstallationMetadata;
import org.gradle.internal.jvm.inspection.JvmMetadataDetector;
import org.gradle.internal.operations.BuildOperationProgressEventEmitter;

import javax.inject.Inject;

public class JavaToolchainFactory {

    private final JavaCompilerFactory compilerFactory;
    private final ToolchainToolFactory toolFactory;
    private final FileFactory fileFactory;
    private final JvmMetadataDetector detector;
    private final BuildOperationProgressEventEmitter eventEmitter;

    @Inject
    public JavaToolchainFactory(
        JvmMetadataDetector detector,
        JavaCompilerFactory compilerFactory,
        ToolchainToolFactory toolFactory,
        FileFactory fileFactory,
        BuildOperationProgressEventEmitter eventEmitter
    ) {
        this.detector = detector;
        this.compilerFactory = compilerFactory;
        this.toolFactory = toolFactory;
        this.fileFactory = fileFactory;
        this.eventEmitter = eventEmitter;
    }

    public JavaToolchainInstantiationResult newInstance(InstallationLocation javaHome, JavaToolchainInput input, boolean isFallbackToolchain) {
        final JvmInstallationMetadata metadata = detector.getMetadata(javaHome);
        if (metadata.isValidInstallation()) {
            final JavaToolchain toolchain = new JavaToolchain(metadata, compilerFactory, toolFactory, fileFactory, input, isFallbackToolchain, eventEmitter);
            return new JavaToolchainInstantiationResult(javaHome, metadata, toolchain);
        }
        return new JavaToolchainInstantiationResult(javaHome, metadata);
    }

}
