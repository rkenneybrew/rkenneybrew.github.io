/*
 * Copyright 2023 the original author or authors.
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

package org.gradle.api.internal.artifacts.transform;

import org.gradle.execution.plan.Node;
import org.gradle.execution.plan.ToPlannedNodeConverter;
import org.gradle.internal.taskgraph.CalculateTaskGraphBuildOperationType;
import org.gradle.operations.dependencies.transforms.PlannedTransformStepIdentity;

/**
 * A converter from {@link TransformationNode} to {@link CalculateTaskGraphBuildOperationType.PlannedNode}.
 */
public class ToPlannedTransformStepConverter implements ToPlannedNodeConverter {

    @Override
    public Class<? extends Node> getSupportedNodeType() {
        return TransformationNode.class;
    }

    @Override
    public PlannedTransformStepIdentity getNodeIdentity(Node node) {
        TransformationNode transformationNode = (TransformationNode) node;
        return transformationNode.getNodeIdentity();
    }

    @Override
    public boolean isInSamePlan(Node node) {
        return true;
    }

    @Override
    public CalculateTaskGraphBuildOperationType.PlannedNode convert(Node node, DependencyLookup dependencyLookup) {
        TransformationNode transformationNode = (TransformationNode) node;
        return new DefaultPlannedTransformStep(
            transformationNode.getNodeIdentity(),
            dependencyLookup.findNodeDependencies(transformationNode)
        );
    }

    @Override
    public String toString() {
        return "ToPlannedTransformStepConverter(" + getSupportedNodeType().getSimpleName() + ")";
    }
}
