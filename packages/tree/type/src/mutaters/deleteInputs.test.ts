import { clone } from "remeda";
import { treeMock } from "../mocks/tree.mock";
import { deleteInputs } from "./deleteInputs";
import { expect, test, beforeEach } from "vitest";

let currentTreeMock;
beforeEach(() => {
  currentTreeMock = clone(treeMock);
});

test("deleteInputs should properly delete the input", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(treeMock.inputs).toMatchInlineSnapshot(`
    {
      "50b7733c-c7ab-4035-b26f-801ea8eca9fe": {
        "answers": [
          {
            "id": "1",
            "text": "Ja",
          },
        ],
        "id": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
        "type": "select",
      },
      "7adcfc07-cefd-45a8-ba42-c19860eb26c5": {
        "answers": [
          {
            "id": "3c5827b3-2565-4623-850b-de463a5ee946",
            "text": "Nein",
          },
          {
            "id": "dfec1b30-fc51-43a6-9e6f-db71933a8274",
            "text": "Vielleicht",
          },
        ],
        "id": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
        "type": "select",
      },
    }
  `);
});

test("deleteInputs should remove the input relation from all Nodes", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(treeMock.nodes).toMatchInlineSnapshot(`
      {
        "65f93264-6354-4e0b-86c1-3cc9e85db77a": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
            ],
            "content": [],
            "inputs": [
              "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
            ],
            "name": "Zweiter Knoten",
          },
          "id": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
        "72444c0f-8838-43f6-b395-bf3207386ac2": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
            ],
            "content": [],
            "inputs": [
              "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
            ],
            "name": "Dritter Knoten",
          },
          "id": "72444c0f-8838-43f6-b395-bf3207386ac2",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
        "e35ba071-6c5f-414f-98b1-a898305e038c": {
          "data": {
            "conditions": [
              "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
            ],
            "content": [],
            "inputs": [
              "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
            ],
            "name": "Erster Knoten",
          },
          "id": "e35ba071-6c5f-414f-98b1-a898305e038c",
          "position": {
            "x": 0,
            "y": 0,
          },
          "type": "customNode",
        },
      }
    `);
});

test("deleteInputs should remove all conditions related to the removed input", () => {
  deleteInputs(currentTreeMock)(["50b7733c-c7ab-4035-b26f-801ea8eca9fe"]);

  expect(treeMock.conditions).toMatchInlineSnapshot(`
      {
        "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99": {
          "answer": "Ja",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "50b7733c-c7ab-4035-b26f-801ea8eca9fe",
          "type": "select",
        },
        "ff9accd5-a509-4071-a503-a2ae6e2d3d7c": {
          "answer": "Vielleicht",
          "id": "9c07e4c3-a67f-4c76-8c14-9a0a302b5d99",
          "inputId": "7adcfc07-cefd-45a8-ba42-c19860eb26c5",
          "type": "select",
        },
      }
    `);
});

test("deleteInputs should not fail when a passed in inputId has not been found", () => {
  deleteInputs(treeMock)(["test"]);

  expect(treeMock.edges).toMatchInlineSnapshot(`
      {
        "3abeee1c-9662-4af5-a232-037228949002": {
          "data": {
            "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          },
          "id": "3abeee1c-9662-4af5-a232-037228949002",
          "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
          "target": "65f93264-6354-4e0b-86c1-3cc9e85db77a",
          "type": "default",
        },
        "5aef09a9-ddde-4913-b139-e28421a7ada0": {
          "data": {
            "conditionId": "ff9accd5-a509-4071-a503-a2ae6e2d3d7c",
          },
          "id": "5aef09a9-ddde-4913-b139-e28421a7ada0",
          "source": "e35ba071-6c5f-414f-98b1-a898305e038c",
          "target": "72444c0f-8838-43f6-b395-bf3207386ac2",
          "type": "default",
        },
      }
    `);
});
