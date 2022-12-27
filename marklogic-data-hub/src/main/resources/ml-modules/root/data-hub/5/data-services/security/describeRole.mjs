/**
 Copyright (c) 2021 MarkLogic Corporation

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
'use strict';

xdmp.securityAssert("http://marklogic.com/xdmp/privileges/xdmp-role-privileges", "execute");
xdmp.securityAssert("http://marklogic.com/xdmp/privileges/xdmp-role-roles", "execute");

const roleName = external.roleName;

import describLib from "/data-hub/5/security/describe-lib.mjs";
describLib.describeRole(roleName);
