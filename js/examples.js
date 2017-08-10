formatTypes = ["biopax", "sif", "txt", "gsea", "sbgn"];

api = [
    {
        "name":"Search",
        "description":"A full-text search in this BioPAX database using the Lucene query syntax.",
        "output":"The specified BioPAX individuals that match the search criteria ",
        "params":[
            {
                "param":"q",
                "description":"Query",
                "example":"Q06609",
                "required":true
            },
            {
                "param":"datasource",
                "description":"Datasource",
                "example":"reactome",
                "required":false
            },
            {
                "param":"organism",
                "description":"Organism",
                "example":"homo sapiens",
                "required":false
            },
            {
                "param":"type",
                "description":"BioPAX Class",
                "options":[
                    "BiochemicalReaction",
                    "Protein",
                    "ProteinReference",
                    "PublicationXref",
                    "RelationshipXref",
                    "SmallMolecule",
                    "SmallMoleculeReference",
                    "UnificationXref"
                ],
                "required":false
            },
            {
                "param":"returnType",
                "description":"Return Type",
                "options":[
                    "json",
                    "xml"
                ],
                "required":false
            }
        ],
        "examples": [
            {
                "id":"search1",
                "description":"A basic text search. This query returns all entities that contain the 'Q06609' keyword in XML",
                "params":[
                    {
                        "param":"q",
                        "value":"Q06609"
                    },
                    {
                        "param":"returnType",
                        "value":"xml"
                    }
                ]
            },{
                "id":"search2",
                "description":"Search for Pathways containing 'Q06609' (search all fields), return JSON",
                "params":[
                    {
                        "param":"q",
                        "value":"Q06609"
                    },
                    {
                        "param":"returnType",
                        "value":"json"
                    },
                    {
                        "param":"type",
                        "value":"pathway"
                    }
                ]
            },
            {
                "id":"search3",
                "description":"Search for ProteinReference entries that contain 'brca2' keyword in any indexed field, return only human proteins from NCI Pathway Interaction Database",
                "params":[
                    {
                        "param":"q",
                        "value":"brca2"
                    },
                    {
                        "param":"type",
                        "value":"proteinreference"
                    },
                    {
                        "param":"organism",
                        "value":"homo sapiens"
                    },
                    {
                        "param":"datasource",
                        "value":"pid"
                    }
                ]
            }
        ]
    },
    {
        "name":"Get",
        "description":"Retrieves an object model for one or several BioPAX elements.",
        "output":"BioPAX (default) representation for the record(s) pointed to by the given URI(s) is returned.",
        "params":[
            {
                "param":"uri",
                "description":"BioPAX element URI (RDF ID)",
                "example":"http://identifiers.org/uniprot/Q06609",
                "required":true
            },
            {
                "param":"format",
                "description":"Output format",
                "options":formatTypes,
                "required":false
            }
        ],
        "examples": [
            {
                "id":"get1",
                "description":"BioPAX representation of http://identifiers.org/uniprot/Q06609",
                "params":[
                    {
                        "param":"uri",
                        "value":"http://identifiers.org/uniprot/Q06609"
                    }
                ]
            },{
                "id":"get2",
                "description":"Get by HUGO gene symbol COL5A1",
                "params":[
                    {
                        "param":"uri",
                        "value":"COL5A1"
                    }
                ]
            },
            {
                "id":"get3",
                "description":"Get the Signaling by BMP Pathway as a SIF",
                "params":[
                    {
                        "param":"uri",
                        "value":"http://identifiers.org/reactome/REACT_12034.3"
                    },{
                        "param":"format",
                        "value":"sif"
                    },

                ]
            }
        ]
    },
    {
        "name":"Graph",
        "description":"Graph searches are useful for finding connections and neighborhoods of elements.",
        "output":"By default, graph queries return a complete BioPAX representation of the subnetwork matched by the algorithm.",
        "params":[
            {
                "param":"kind",
                "description":"Graph search kind",
                "options":[
                    "commonstream",
                    "neighborhood",
                    "pathsbetween",
                    "pathsfromto"
                ],
                "required":true
            },
            {
                "param":"source",
                "description":"Source URI",
                "example":"http://identifiers.org/uniprot/P20908",
                "required":true
            },
            {
                "param":"target",
                "description":"Target URI",
                "example":"http://identifiers.org/uniprot/P20908",
                "required":false
            },
            {
                "param":"direction",
                "description":"Graph search direction",
                "options":[
                    "bothstream",
                    "downstream",
                    "undirected",
                    "upstream"
                ],
                "required":false
            },
            {
                "param":"limit",
                "description":"Search distance limit",
                "example":"1",
                "required":false
            },
            {
                "param":"datasource",
                "description":"Datasource",
                "example":"reactome",
                "required":false
            },
            {
                "param":"organism",
                "description":"Organism",
                "example":"homo sapiens",
                "required":false
            },
            {
                "param":"format",
                "description":"Format",
                "options":formatTypes,
                "required":false
            }
        ],
        "examples": [
            {
                "id":"graph1",
                "description":"This query finds the BioPAX nearest neighborhood of the protein reference",
                "params":[
                    {
                        "param":"source",
                        "value":"http://identifiers.org/uniprot/P20908"
                    },{
                        "param":"kind",
                        "value":"neighborhood"
                    },{
                        "param":"format",
                        "value":"TXT"
                    }
                ]
            },{
                "id":"graph2",
                "description":"This query finds the 1 distance neighborhood of P20908",
                "params":[
                    {
                        "param":"source",
                        "value":"P20908"
                    },{
                        "param":"kind",
                        "value":"neighborhood"
                    }
                ]
            },
            {
                "id":"graph3",
                "description":"A similar query using the gene symbol COL5A1 instead of URI or UniProt ID",
                "params":[
                    {
                        "param":"source",
                        "value":"COL5A1"
                    },{
                        "param":"kind",
                        "value":"neighborhood"
                    }
                ]
            }
        ]
    },
    {
        "name":"Traverse",
        "description":"Provides XPath-like access to this BioPAX database.",
        "output":"XML result according to the Search Response XML Schema.",
        "params":[
            {
                "param":"uri",
                "description":"BioPAX element URI (RDF ID)",
                "example":"http://identifiers.org/uniprot/P38398",
                "required":true
            },
            {
                "param":"path",
                "description":"BioPAX property path in the form of property1[:type1]/property2[:type2]",
                "example":"ProteinReference/organism/displayName",
                "required":true
            }
        ],
        "examples": [
            {
                "id":"traverse1",
                "description":"This query returns the display name of the organism of the ProteinReference specified by the URI",
                "params":[
                    {
                        "param":"uri",
                        "value":"http://identifiers.org/uniprot/P38398"
                    },{
                        "param":"path",
                        "value":"ProteinReference/organism/displayName"
                    }
                ]
            },{
                "id":"traverse2",
                "description":"This query returns the names of all states of RAD51 protein (by its ProteinReference URI, using property path='ProteinReference/entityReferenceOf:Protein/name')",
                "params":[
                    {
                        "param":"uri",
                        "value":"http://identifiers.org/uniprot/Q06609"
                    },{
                        "param":"path",
                        "value":"ProteinReference/entityReferenceOf:Protein/name"
                    }
                ]
            },
            {
                "id":"traverse3",
                "description":"This query returns the URIs of states of BRCA1_HUMAN",
                "params":[
                    {
                        "param":"uri",
                        "value":"http://identifiers.org/uniprot/P38398"
                    },{
                        "param":"path",
                        "value":"ProteinReference/entityReferenceOf:Protein"
                    }
                ]
            }
        ]
    }
];

// Find all the unique functions represented
// Get a list of parameters for a function
// For each example add in any missing parameters
// Compile the template for each example
// Append the example to the functions example div
