import { Tree } from "../type-classes";
import { Required } from "utility-types";

export const mietminderungTreeMock: Required<Tree.TTree, "startNode"> = {
  startNode: "ba80a8f1-f2bb-4636-b936-9b343903b060",
  nodes: {
    "ba80a8f1-f2bb-4636-b936-9b343903b060": {
      id: "ba80a8f1-f2bb-4636-b936-9b343903b060",
      inputs: ["cbca524c-4b3d-4a99-a85c-68f8d57487c2"],
      name: "Start",
      content: {
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: {
              level: 1,
            },
            content: [
              {
                type: "text",
                text: "Willkommen! ",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Dieser Entscheidungsbaum dient dazu, eine erste grobe Einschätzung zu erhalten, ob Ihnen womöglich eine Mietminderung zusteht.",
              },
            ],
          },
        ],
      },
      type: "customNode",
      position: {
        x: -162,
        y: -163,
      },
    },
    "2ccf5f67-3149-4434-a5d6-51760b48fe2f": {
      id: "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
      name: "Wirksamer Mietvertrag",
      inputs: ["49f7bbaa-f58c-4310-9137-b19fd89d4848"],
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Existiert ein wirksamer Mietvertrag zwischen Ihnen und dem Vermieter?",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Dies ist beispielsweise nicht der Fall, wenn der Mietvertrag in der Vergangenheit wirksam gekündigt wurde.",
              },
            ],
          },
        ],
      },
      type: "customNode",
      position: {
        x: -162,
        y: -10,
      },
    },
    "71b50b99-60fb-488f-a26d-a261b16292b5": {
      id: "71b50b99-60fb-488f-a26d-a261b16292b5",
      name: "Mangel",
      inputs: ["1f0b7346-76d2-4b80-9365-3bdd563e5371"],
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "An dieser Stelle geht es darum, herauszufinden ",
              },
              {
                type: "text",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                text: "welche Art von Mangel an der Mietsache",
              },
              {
                type: "text",
                text: " womöglich besteht. Es wird dabei zwischen zwei verschiedenen Arten unterschieden:",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Einerseits gibt es den ",
              },
              {
                type: "text",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                text: "Sachmangel",
              },
              {
                type: "text",
                text: ". Dieser zeichnet sich vereinfacht gesagt dadurch aus, dass mit der Wohnung selbst etwas nicht stimmt, wie zum Beispiel bei Schimmelbefall, undichten Stellen und so weiter.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Andererseits gibt es den ",
              },
              {
                type: "text",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                text: "Rechtsmangel",
              },
              {
                type: "text",
                text: ". Hier ist die Wohnung an sich vollkommen in Ordnung, jedoch bestehen rechtliche Hindernisse. Diese liegen meist darin, dass irgendwelche Dritte - also weder der Vermieter noch Sie als Mieter - Ansprüche geltend machen, die ihr Mietverhältnis stören. Zum Beispiel besteht ein Rechtsmangel, wenn die Wohnung vom Vermieter mehrmals zur selben Zeit vermietet wurde und er nun die Übergabe der Wohnung verweigert oder auch von Ihnen die Räumung verlangt.",
              },
            ],
          },
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Als Sonderfall ist noch die sogenannte ",
              },
              {
                type: "text",
                marks: [
                  {
                    type: "bold",
                  },
                ],
                text: "Zusicherung",
              },
              {
                type: "text",
                text: " zu nennen. Hier hat ihr Vermieter Ihnen ausdrücklich eine bestimmte Eigenschaft der Wohnung zugesichert. Wenn diese Eigenschaft, dann jedoch nicht vorliegt oder später weg fällt, liegt ebenso ein Mangel vor.",
              },
            ],
          },
        ],
      },
      type: "customNode",
      position: {
        x: -158,
        y: 180,
      },
    },
    "6d373a6f-0448-44da-b692-b5330d9e1bdc": {
      id: "6d373a6f-0448-44da-b692-b5330d9e1bdc",
      name: "Keine Mietminderung",
      inputs: ["c4c439ef-cecd-48d6-abca-0e3caf1b8a4e"],
      type: "customNode",
      position: {
        x: -714,
        y: 389,
      },
    },
    "01370a54-f55b-4700-b070-37c7763e37ba": {
      id: "01370a54-f55b-4700-b070-37c7763e37ba",
      name: "Kontaktvermittlung",
      inputs: ["0226a6a7-67d2-4190-a7e3-dad27ab32d65"],
      type: "customNode",
      position: {
        x: 445,
        y: 376,
      },
    },
    "8c3b1ce7-67a6-4fa4-bdca-e93836f66f97": {
      id: "8c3b1ce7-67a6-4fa4-bdca-e93836f66f97",
      name: "Sachmangel",
      inputs: ["a2392479-0a12-471d-a437-82068345220f"],
      type: "customNode",
      position: {
        x: 70,
        y: 388,
      },
    },
    "b4440776-e6c8-4c3a-90bf-0644a3be5d2e": {
      id: "b4440776-e6c8-4c3a-90bf-0644a3be5d2e",
      name: "Rechtmangel",
      inputs: ["d030cdfa-01ca-4401-9e55-ec76984363ae"],
      type: "customNode",
      position: {
        x: -149,
        y: 388,
      },
    },
    "99672d90-3fbd-4f74-ac1b-7e70f7030149": {
      id: "99672d90-3fbd-4f74-ac1b-7e70f7030149",
      name: "Zusicherung",
      inputs: ["0dac8ba5-8c5f-4345-ab64-19a9830f7da2"],
      type: "customNode",
      position: {
        x: -364,
        y: 388,
      },
    },
  },
  inputs: {
    "cbca524c-4b3d-4a99-a85c-68f8d57487c2": {
      id: "cbca524c-4b3d-4a99-a85c-68f8d57487c2",
      type: "select",
      data: {
        answers: [
          {
            id: "9675cc27-b1a3-4dfe-a759-0eff5e7a2cf3",
            text: "Verstanden",
          },
        ],
      },
    },
    "49f7bbaa-f58c-4310-9137-b19fd89d4848": {
      id: "49f7bbaa-f58c-4310-9137-b19fd89d4848",
      type: "select",
      data: {
        answers: [
          {
            id: "28032f85-5c88-4a5e-80af-9d8862df66b2",
            text: "Ja",
          },
          {
            id: "8d0946ab-5934-4bb7-8203-d1cb41b73aba",
            text: "Nein",
          },
          {
            id: "6085a6da-0b8c-4d6c-a3ff-e0c691679b78",
            text: "Ich bin mir nicht sicher",
          },
        ],
      },
    },
    "1f0b7346-76d2-4b80-9365-3bdd563e5371": {
      id: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      type: "select",
      data: {
        answers: [
          {
            id: "a84af454-b401-428e-8654-a7916bb1c7ad",
            text: "Ich glaube, dass ein Sachmangel vorliegt",
          },
          {
            id: "c2ab6b42-914d-466d-ab18-2ec618b435b0",
            text: "Ich glaube, dass ein Rechtsmangel vorliegt",
          },
          {
            id: "9c31892f-23d6-46b8-943f-ce11e6ef7d18",
            text: "Mein Vermieter hat mir eine Eigenschaft zugesichert",
          },
          {
            id: "9bd056ce-a79e-42e1-8d27-8aa5ff80c7c6",
            text: "Ich glaube, es liegt kein Mangel vor",
          },
          {
            id: "b60aa953-7058-4982-a4ed-32586a71c433",
            text: "Ich bin mir nicht sicher",
          },
        ],
      },
    },
    "c4c439ef-cecd-48d6-abca-0e3caf1b8a4e": {
      id: "c4c439ef-cecd-48d6-abca-0e3caf1b8a4e",
      type: "select",
      data: { answers: [] },
    },
    "0226a6a7-67d2-4190-a7e3-dad27ab32d65": {
      id: "0226a6a7-67d2-4190-a7e3-dad27ab32d65",
      type: "select",
      data: { answers: [] },
    },
    "a2392479-0a12-471d-a437-82068345220f": {
      id: "a2392479-0a12-471d-a437-82068345220f",
      type: "select",
      data: { answers: [] },
    },
    "d030cdfa-01ca-4401-9e55-ec76984363ae": {
      id: "d030cdfa-01ca-4401-9e55-ec76984363ae",
      type: "select",
      data: { answers: [] },
    },
    "0dac8ba5-8c5f-4345-ab64-19a9830f7da2": {
      id: "0dac8ba5-8c5f-4345-ab64-19a9830f7da2",
      type: "select",
      data: { answers: [] },
    },
  },
  conditions: {
    "c0df5a50-7ab9-4232-97d3-40923b850dda": {
      id: "c0df5a50-7ab9-4232-97d3-40923b850dda",
      type: "compare",
      inputId: "cbca524c-4b3d-4a99-a85c-68f8d57487c2",
      data: { answerId: "9675cc27-b1a3-4dfe-a759-0eff5e7a2cf3" },
    },
    "998e7030-7ac4-4064-8996-d01f3c3d52bb": {
      id: "998e7030-7ac4-4064-8996-d01f3c3d52bb",
      type: "compare",
      inputId: "49f7bbaa-f58c-4310-9137-b19fd89d4848",
      data: { answerId: "28032f85-5c88-4a5e-80af-9d8862df66b2" },
    },
    "6faeec82-e4c2-4c19-82a0-fa7d3f7965ec": {
      id: "6faeec82-e4c2-4c19-82a0-fa7d3f7965ec",
      type: "compare",
      inputId: "49f7bbaa-f58c-4310-9137-b19fd89d4848",
      data: { answerId: "8d0946ab-5934-4bb7-8203-d1cb41b73aba" },
    },
    "a5c1d893-82be-4b68-95e5-3228e546e44a": {
      id: "a5c1d893-82be-4b68-95e5-3228e546e44a",
      type: "compare",
      inputId: "49f7bbaa-f58c-4310-9137-b19fd89d4848",
      data: { answerId: "6085a6da-0b8c-4d6c-a3ff-e0c691679b78" },
    },
    "d57c833f-7139-4943-94ef-f05998512c95": {
      id: "d57c833f-7139-4943-94ef-f05998512c95",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "b60aa953-7058-4982-a4ed-32586a71c433" },
    },
    "baf2c3b8-13c6-4b10-a32b-63ab7fdb01df": {
      id: "baf2c3b8-13c6-4b10-a32b-63ab7fdb01df",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "a84af454-b401-428e-8654-a7916bb1c7ad" },
    },
    "a1bbb537-6539-4b2b-8d02-d80827d5b58b": {
      id: "a1bbb537-6539-4b2b-8d02-d80827d5b58b",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "c2ab6b42-914d-466d-ab18-2ec618b435b0" },
    },
    "65943f1c-06cd-44a0-9a58-deee5628cef1": {
      id: "65943f1c-06cd-44a0-9a58-deee5628cef1",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "9c31892f-23d6-46b8-943f-ce11e6ef7d18" },
    },
    "8c79a315-fd90-47e8-b448-46b81b788e76": {
      id: "8c79a315-fd90-47e8-b448-46b81b788e76",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "9bd056ce-a79e-42e1-8d27-8aa5ff80c7c6" },
    },
    "c4b6d455-ee56-4f4c-b0cd-8bab29ea58ad": {
      id: "c4b6d455-ee56-4f4c-b0cd-8bab29ea58ad",
      type: "compare",
      inputId: "1f0b7346-76d2-4b80-9365-3bdd563e5371",
      data: { answerId: "9c31892f-23d6-46b8-943f-ce11e6ef7d18" },
    },
  },
  edges: {
    "7b3fa9d3-314b-4dfe-95f1-7703827d45f4": {
      id: "7b3fa9d3-314b-4dfe-95f1-7703827d45f4",
      type: "default",
      source: "ba80a8f1-f2bb-4636-b936-9b343903b060",
      target: "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
      conditionId: "c0df5a50-7ab9-4232-97d3-40923b850dda",
    },
    "dc91681b-576f-48f7-8184-123016a6b45f": {
      id: "dc91681b-576f-48f7-8184-123016a6b45f",
      type: "default",
      source: "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
      target: "71b50b99-60fb-488f-a26d-a261b16292b5",
      conditionId: "998e7030-7ac4-4064-8996-d01f3c3d52bb",
    },
    "c84e642c-ad1e-49f4-829f-811db79ebb2b": {
      id: "c84e642c-ad1e-49f4-829f-811db79ebb2b",
      type: "default",
      source: "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
      target: "6d373a6f-0448-44da-b692-b5330d9e1bdc",
      conditionId: "6faeec82-e4c2-4c19-82a0-fa7d3f7965ec",
    },
    "aad1cd78-92c3-48b4-a9e1-a6f1d503edf4": {
      id: "aad1cd78-92c3-48b4-a9e1-a6f1d503edf4",
      type: "default",
      source: "2ccf5f67-3149-4434-a5d6-51760b48fe2f",
      target: "01370a54-f55b-4700-b070-37c7763e37ba",
      conditionId: "a5c1d893-82be-4b68-95e5-3228e546e44a",
    },
    "d94b8403-e009-4d99-9061-80e2d6c86392": {
      id: "d94b8403-e009-4d99-9061-80e2d6c86392",
      type: "default",
      source: "71b50b99-60fb-488f-a26d-a261b16292b5",
      target: "01370a54-f55b-4700-b070-37c7763e37ba",
      conditionId: "d57c833f-7139-4943-94ef-f05998512c95",
    },
    "bcd353e7-6029-49e4-a4c1-7c0a72048c25": {
      id: "bcd353e7-6029-49e4-a4c1-7c0a72048c25",
      type: "default",
      source: "71b50b99-60fb-488f-a26d-a261b16292b5",
      target: "8c3b1ce7-67a6-4fa4-bdca-e93836f66f97",
      conditionId: "baf2c3b8-13c6-4b10-a32b-63ab7fdb01df",
    },
    "7ab7a7c5-db48-4851-9162-099a8ab715f8": {
      id: "7ab7a7c5-db48-4851-9162-099a8ab715f8",
      type: "default",
      source: "71b50b99-60fb-488f-a26d-a261b16292b5",
      target: "b4440776-e6c8-4c3a-90bf-0644a3be5d2e",
      conditionId: "a1bbb537-6539-4b2b-8d02-d80827d5b58b",
    },
    "589f8532-04eb-4858-91cb-038415e5fb48": {
      id: "589f8532-04eb-4858-91cb-038415e5fb48",
      type: "default",
      source: "71b50b99-60fb-488f-a26d-a261b16292b5",
      target: "6d373a6f-0448-44da-b692-b5330d9e1bdc",
      conditionId: "8c79a315-fd90-47e8-b448-46b81b788e76",
    },
    "ddb57111-42b0-4895-822f-6d6b9d393f90": {
      id: "ddb57111-42b0-4895-822f-6d6b9d393f90",
      type: "default",
      source: "71b50b99-60fb-488f-a26d-a261b16292b5",
      target: "99672d90-3fbd-4f74-ac1b-7e70f7030149",
      conditionId: "c4b6d455-ee56-4f4c-b0cd-8bab29ea58ad",
    },
  },
};
