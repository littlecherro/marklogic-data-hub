/**
 Copyright (c) 2020 MarkLogic Corporation

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

declareUpdate();

var endpointState;
var input;

const state = fn.head(xdmp.fromJSON(endpointState));
const work = fn.head(xdmp.fromJSON(workUnit));

const doc = {
  input: input,
  endpointState: state,
  workUnit: work
};

xdmp.documentInsert(
  "/test/doc.json",
  doc,
  {
    permissions: [
      xdmp.permission('data-hub-common', 'read'),
      xdmp.permission('data-hub-common', 'update')
    ]
  }
);
