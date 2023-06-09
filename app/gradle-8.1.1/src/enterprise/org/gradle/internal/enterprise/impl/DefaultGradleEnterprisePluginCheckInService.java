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

package org.gradle.internal.enterprise.impl;

import org.gradle.internal.buildtree.BuildModelParameters;
import org.gradle.internal.enterprise.GradleEnterprisePluginCheckInResult;
import org.gradle.internal.enterprise.GradleEnterprisePluginCheckInService;
import org.gradle.internal.enterprise.GradleEnterprisePluginMetadata;
import org.gradle.internal.enterprise.GradleEnterprisePluginServiceFactory;
import org.gradle.internal.enterprise.GradleEnterprisePluginServiceRef;
import org.gradle.internal.enterprise.core.GradleEnterprisePluginManager;
import org.gradle.util.internal.VersionNumber;

import java.util.function.Supplier;

public class DefaultGradleEnterprisePluginCheckInService implements GradleEnterprisePluginCheckInService {

    private final GradleEnterprisePluginManager manager;
    private final DefaultGradleEnterprisePluginAdapter adapter;
    private final boolean isConfigurationCacheEnabled;

    public DefaultGradleEnterprisePluginCheckInService(
        BuildModelParameters buildModelParameters,
        GradleEnterprisePluginManager manager,
        DefaultGradleEnterprisePluginAdapter adapter
    ) {
        this.manager = manager;
        this.adapter = adapter;
        this.isConfigurationCacheEnabled = buildModelParameters.isConfigurationCache();
    }

    // Used just for testing
    public static final String UNSUPPORTED_TOGGLE = "org.gradle.internal.unsupported-enterprise-plugin";
    public static final String UNSUPPORTED_TOGGLE_MESSAGE = "Enterprise plugin unsupported due to secret toggle";

    // For Gradle versions 8+, configuration caching builds are not compatible with Gradle Enterprise plugin < 3.12
    public static final VersionNumber MINIMUM_SUPPORTED_PLUGIN_VERSION_FOR_CONFIGURATION_CACHING = VersionNumber.version(3, 12);
    public static final String UNSUPPORTED_PLUGIN_DUE_TO_CONFIGURATION_CACHING_MESSAGE = String.format("The Gradle Enterprise plugin has been disabled as it is " +
            "incompatible with this version of Gradle and the configuration caching feature - please upgrade to version %s.%s or later of the Gradle Enterprise plugin to restore functionality.",
        MINIMUM_SUPPORTED_PLUGIN_VERSION_FOR_CONFIGURATION_CACHING.getMajor(),
        MINIMUM_SUPPORTED_PLUGIN_VERSION_FOR_CONFIGURATION_CACHING.getMinor());

    @Override
    public GradleEnterprisePluginCheckInResult checkIn(GradleEnterprisePluginMetadata pluginMetadata, GradleEnterprisePluginServiceFactory serviceFactory) {
        if (Boolean.getBoolean(UNSUPPORTED_TOGGLE)) {
            manager.unsupported();
            return checkInResult(UNSUPPORTED_TOGGLE_MESSAGE, () -> {
                throw new IllegalStateException();
            });
        }
        if (isUnsupportedWithConfigurationCaching(pluginMetadata)) {
            manager.unsupported();
            return checkInResult(UNSUPPORTED_PLUGIN_DUE_TO_CONFIGURATION_CACHING_MESSAGE, () -> {
                throw new IllegalStateException();
            });
        }
        GradleEnterprisePluginServiceRef ref = adapter.register(serviceFactory);
        manager.registerAdapter(adapter);
        return checkInResult(null, () -> ref);
    }

    private static GradleEnterprisePluginCheckInResult checkInResult(String unsupportedMessage, Supplier<GradleEnterprisePluginServiceRef> pluginServiceRefSupplier) {
        return new GradleEnterprisePluginCheckInResult() {
            @Override
            public String getUnsupportedMessage() {
                return unsupportedMessage;
            }

            @Override
            public GradleEnterprisePluginServiceRef getPluginServiceRef() {
                return pluginServiceRefSupplier.get();
            }
        };
    }

    private boolean isUnsupportedWithConfigurationCaching(GradleEnterprisePluginMetadata pluginMetadata) {
        VersionNumber version = VersionNumber.parse(pluginMetadata.getVersion()).getBaseVersion();
        return isConfigurationCacheEnabled && MINIMUM_SUPPORTED_PLUGIN_VERSION_FOR_CONFIGURATION_CACHING.compareTo(version) > 0;
    }

}
