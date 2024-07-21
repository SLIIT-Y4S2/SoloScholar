import { LabSheet } from "../types/lab.types";

export const labSheet: LabSheet = {
    "realWorldScenario": "In this practical lab, students will be tasked with designing and implementing a database system for a fictional company called \"TechSolutions Inc.\" TechSolutions Inc. is a rapidly growing technology consulting firm that provides a wide range of services, including software development, IT consulting, and cybersecurity solutions. As the company expands, it faces increasing challenges in managing its data efficiently. Currently, TechSolutions Inc. uses a combination of spreadsheets and ad-hoc file storage systems to keep track of its clients, projects, employees, and financial transactions. This fragmented approach has led to data inconsistencies, difficulties in data retrieval, and inefficiencies in generating reports. To address these issues, the company has decided to implement a centralized database system that will streamline data management and improve overall operational efficiency.\n\nThe new database system will need to store and manage various types of data, including client information, project details, employee records, and financial transactions. Each client has unique attributes such as name, contact information, industry, and the services they have availed. Projects are associated with specific clients and have attributes like project name, description, start date, end date, budget, and status. Employees are categorized by their roles, skills, and departments, and their records include personal information, employment history, and current project assignments. Financial transactions encompass invoices, payments, and expenses, each with attributes like transaction date, amount, and associated project or client. The database must support complex queries to generate reports such as project progress, employee utilization, client billing, and financial summaries. Additionally, the system should be designed to handle indexing efficiently to ensure quick data retrieval and support for high write/insert rates, given the dynamic nature of the company's operations.\n\nTo achieve these objectives, students will need to design the database schema, create tables with appropriate relationships, and implement indexing strategies to optimize performance. They will also need to consider the use of various indexing structures such as B+-trees, hash indices, and bitmap indices to support different types of queries and access patterns. For instance, B+-trees can be used for ordered indexing to facilitate range queries on dates and budgets, while hash indices can be employed for quick lookups based on unique identifiers like client IDs or project IDs. Bitmap indices may be useful for attributes with a limited number of distinct values, such as project status or employee roles. Students will also explore techniques for tuning indexes, such as prefix compression for string indexing and rebuilding indexes to reclaim wasted space or improve performance. By the end of the lab, students will have a comprehensive understanding of database design and indexing strategies, enabling them to create a robust and efficient database system for TechSolutions Inc.",
    "detailedLabOutline": {
        "subTopics": [
            {
                "title": "Introduction to Indexing Structures",
                "description": "This section introduces the concept of indexing structures in database systems. Students will learn about the purpose of indexes, which is to speed up the retrieval of records based on certain search conditions. Key points include the types of primary file organizations (unordered, ordered, hashed) and the role of auxiliary access structures. Bloom's Taxonomy Level: Understand."
            },
            {
                "title": "Single-Level Ordered Indexes",
                "description": "This section covers the different types of single-level ordered indexes, including primary, secondary, and clustering indexes. Students will understand how these indexes are structured and how they facilitate efficient data retrieval. Key points include the concept of an ordered file and the construction of indexes on various fields. Bloom's Taxonomy Level: Understand, Apply."
            },
            {
                "title": "Multilevel Indexes and ISAM",
                "description": "This section delves into multilevel indexes and the Indexed Sequential Access Method (ISAM). Students will learn how additional indexes can be developed for single-level indexes, leading to multilevel indexing. The ISAM technique will be discussed in detail. Bloom's Taxonomy Level: Understand, Apply."
            },
            {
                "title": "B-trees and B+-trees",
                "description": "This section explains the B-tree and B+-tree data structures, which are commonly used in DBMSs for dynamically changing databases. Students will learn about the advantages and disadvantages of these structures, including their complexity and fanout. Bloom's Taxonomy Level: Understand, Apply, Analyze."
            },
            {
                "title": "Hashing Techniques",
                "description": "This section introduces hashing as a technique for building indices in both main memory and disk-based systems. Students will understand how hashing works and its applications in database indexing. Key points include the use of hash functions and the handling of collisions. Bloom's Taxonomy Level: Understand, Apply."
            },
            {
                "title": "Bitmap Indexes",
                "description": "This section covers bitmap indexes, which provide a compact representation for indexing attributes with few distinct values. Students will learn about the efficiency of bitmap indexes in supporting queries on multiple attributes. Bloom's Taxonomy Level: Understand, Apply."
            },
            {
                "title": "Spatial and Temporal Indexes",
                "description": "This section discusses indexing techniques for spatial and temporal data. Students will learn about R-trees and their variants for spatial databases, as well as techniques for indexing temporal data using spatial indexes. Bloom's Taxonomy Level: Understand, Apply, Analyze."
            },
            {
                "title": "Tuning Indexes",
                "description": "This section focuses on the tuning of indexes to optimize database performance. Students will learn about the reasons for revising initial index choices, such as query performance and index utilization. Key points include the use of DBMS commands to analyze query execution plans and the dynamic evaluation of indexing requirements. Bloom's Taxonomy Level: Understand, Apply, Analyze, Evaluate."
            },
            {
                "title": "Rebuilding and Dropping Indexes",
                "description": "This section explains the processes of rebuilding and dropping indexes to improve performance. Students will understand the impact of these operations on database performance and the overhead involved. Key points include the reorganization of clustered indexes and the handling of deletions and insertions. Bloom's Taxonomy Level: Understand, Apply, Analyze, Evaluate."
            }
        ]
    },
    "supportingMaterial": {
        "tables": [
            {
                "tableName": "Clients",
                "columns": [
                    {
                        "name": "ClientID",
                        "type": "INT"
                    },
                    {
                        "name": "Name",
                        "type": "VARCHAR(100)"
                    },
                    {
                        "name": "ContactInfo",
                        "type": "VARCHAR(255)"
                    },
                    {
                        "name": "Industry",
                        "type": "VARCHAR(100)"
                    },
                    {
                        "name": "ServicesAvailed",
                        "type": "VARCHAR(255)"
                    }
                ],
                "rows": [
                    {
                        "ClientID": 1,
                        "Name": "ABC Corp",
                        "ContactInfo": "abc@example.com",
                        "Industry": "Finance",
                        "ServicesAvailed": "IT Consulting"
                    },
                    {
                        "ClientID": 2,
                        "Name": "XYZ Ltd",
                        "ContactInfo": "xyz@example.com",
                        "Industry": "Healthcare",
                        "ServicesAvailed": "Cybersecurity Solutions"
                    }
                ]
            },
            {
                "tableName": "Projects",
                "columns": [
                    {
                        "name": "ProjectID",
                        "type": "INT"
                    },
                    {
                        "name": "ClientID",
                        "type": "INT"
                    },
                    {
                        "name": "ProjectName",
                        "type": "VARCHAR(100)"
                    },
                    {
                        "name": "Description",
                        "type": "TEXT"
                    },
                    {
                        "name": "StartDate",
                        "type": "DATE"
                    },
                    {
                        "name": "EndDate",
                        "type": "DATE"
                    },
                    {
                        "name": "Budget",
                        "type": "DECIMAL(10, 2)"
                    },
                    {
                        "name": "Status",
                        "type": "VARCHAR(50)"
                    }
                ],
                "rows": [
                    {
                        "ProjectID": 1,
                        "ClientID": 1,
                        "ProjectName": "Finance App Development",
                        "Description": "Developing a financial application",
                        "StartDate": "2023-01-01",
                        "EndDate": "2023-06-01",
                        "Budget": 50000,
                        "Status": "In Progress"
                    },
                    {
                        "ProjectID": 2,
                        "ClientID": 2,
                        "ProjectName": "Healthcare Security Audit",
                        "Description": "Conducting a security audit for healthcare systems",
                        "StartDate": "2023-02-01",
                        "EndDate": "2023-04-01",
                        "Budget": 30000,
                        "Status": "Completed"
                    }
                ]
            },
            {
                "tableName": "Employees",
                "columns": [
                    {
                        "name": "EmployeeID",
                        "type": "INT"
                    },
                    {
                        "name": "Name",
                        "type": "VARCHAR(100)"
                    },
                    {
                        "name": "Role",
                        "type": "VARCHAR(50)"
                    },
                    {
                        "name": "Skills",
                        "type": "VARCHAR(255)"
                    },
                    {
                        "name": "Department",
                        "type": "VARCHAR(100)"
                    },
                    {
                        "name": "PersonalInfo",
                        "type": "TEXT"
                    },
                    {
                        "name": "EmploymentHistory",
                        "type": "TEXT"
                    },
                    {
                        "name": "CurrentProjectID",
                        "type": "INT"
                    }
                ],
                "rows": [
                    {
                        "EmployeeID": 1,
                        "Name": "John Doe",
                        "Role": "Software Developer",
                        "Skills": "Java, SQL",
                        "Department": "Development",
                        "PersonalInfo": "Lives in NY",
                        "EmploymentHistory": "Worked at ABC Corp",
                        "CurrentProjectID": 1
                    },
                    {
                        "EmployeeID": 2,
                        "Name": "Jane Smith",
                        "Role": "IT Consultant",
                        "Skills": "Networking, Security",
                        "Department": "Consulting",
                        "PersonalInfo": "Lives in CA",
                        "EmploymentHistory": "Worked at XYZ Ltd",
                        "CurrentProjectID": 2
                    }
                ]
            },
            {
                "tableName": "FinancialTransactions",
                "columns": [
                    {
                        "name": "TransactionID",
                        "type": "INT"
                    },
                    {
                        "name": "TransactionDate",
                        "type": "DATE"
                    },
                    {
                        "name": "Amount",
                        "type": "DECIMAL(10, 2)"
                    },
                    {
                        "name": "AssociatedProjectID",
                        "type": "INT"
                    },
                    {
                        "name": "AssociatedClientID",
                        "type": "INT"
                    },
                    {
                        "name": "Type",
                        "type": "VARCHAR(50)"
                    }
                ],
                "rows": [
                    {
                        "TransactionID": 1,
                        "TransactionDate": "2023-01-15",
                        "Amount": 10000,
                        "AssociatedProjectID": 1,
                        "AssociatedClientID": 1,
                        "Type": "Invoice"
                    },
                    {
                        "TransactionID": 2,
                        "TransactionDate": "2023-02-20",
                        "Amount": 15000,
                        "AssociatedProjectID": 2,
                        "AssociatedClientID": 2,
                        "Type": "Payment"
                    }
                ]
            }
        ],
        "jsonDocument": null,
        "relationalSchema": {
            "Clients": [
                {
                    "name": "ClientID",
                    "type": "INT"
                },
                {
                    "name": "Name",
                    "type": "VARCHAR(100)"
                },
                {
                    "name": "ContactInfo",
                    "type": "VARCHAR(255)"
                },
                {
                    "name": "Industry",
                    "type": "VARCHAR(100)"
                },
                {
                    "name": "ServicesAvailed",
                    "type": "VARCHAR(255)"
                }
            ],
            "Projects": [
                {
                    "name": "ProjectID",
                    "type": "INT"
                },
                {
                    "name": "ClientID",
                    "type": "INT"
                },
                {
                    "name": "ProjectName",
                    "type": "VARCHAR(100)"
                },
                {
                    "name": "Description",
                    "type": "TEXT"
                },
                {
                    "name": "StartDate",
                    "type": "DATE"
                },
                {
                    "name": "EndDate",
                    "type": "DATE"
                },
                {
                    "name": "Budget",
                    "type": "DECIMAL(10, 2)"
                },
                {
                    "name": "Status",
                    "type": "VARCHAR(50)"
                }
            ],
            "Employees": [
                {
                    "name": "EmployeeID",
                    "type": "INT"
                },
                {
                    "name": "Name",
                    "type": "VARCHAR(100)"
                },
                {
                    "name": "Role",
                    "type": "VARCHAR(50)"
                },
                {
                    "name": "Skills",
                    "type": "VARCHAR(255)"
                },
                {
                    "name": "Department",
                    "type": "VARCHAR(100)"
                },
                {
                    "name": "PersonalInfo",
                    "type": "TEXT"
                },
                {
                    "name": "EmploymentHistory",
                    "type": "TEXT"
                },
                {
                    "name": "CurrentProjectID",
                    "type": "INT"
                }
            ],
            "FinancialTransactions": [
                {
                    "name": "TransactionID",
                    "type": "INT"
                },
                {
                    "name": "TransactionDate",
                    "type": "DATE"
                },
                {
                    "name": "Amount",
                    "type": "DECIMAL(10, 2)"
                },
                {
                    "name": "AssociatedProjectID",
                    "type": "INT"
                },
                {
                    "name": "AssociatedClientID",
                    "type": "INT"
                },
                {
                    "name": "Type",
                    "type": "VARCHAR(50)"
                }
            ]
        }
    },
    "questions": [
        {
            "question": "1. Create a B+-tree index on the 'client_name' column of the 'clients' table to facilitate quick lookups of client information. Provide the SQL statement to create this index.",
            "answer": "CREATE INDEX idx_client_name ON clients (client_name);",
            "exampleQuestion": "1. Create a B+-tree index on the 'project_name' column of the 'projects' table to facilitate quick lookups of project information. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE INDEX idx_project_name ON projects (project_name);"
        },
        {
            "question": "2. Implement a hash index on the 'employee_id' column of the 'employees' table to optimize the retrieval of employee records based on their unique IDs. Provide the SQL statement to create this index.",
            "answer": "CREATE INDEX idx_employee_id ON employees USING HASH (employee_id);",
            "exampleQuestion": "2. Implement a hash index on the 'invoice_id' column of the 'invoices' table to optimize the retrieval of invoice records based on their unique IDs. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE INDEX idx_invoice_id ON invoices USING HASH (invoice_id);"
        },
        {
            "question": "3. Create a bitmap index on the 'project_status' column of the 'projects' table to efficiently support queries on project status. Provide the SQL statement to create this index.",
            "answer": "CREATE BITMAP INDEX idx_project_status ON projects (project_status);",
            "exampleQuestion": "3. Create a bitmap index on the 'employee_role' column of the 'employees' table to efficiently support queries on employee roles. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE BITMAP INDEX idx_employee_role ON employees (employee_role);"
        },
        {
            "question": "4. Write a SQL query to rebuild the B+-tree index on the 'client_name' column of the 'clients' table to reclaim wasted space and improve performance.",
            "answer": "ALTER INDEX idx_client_name REBUILD;",
            "exampleQuestion": "4. Write a SQL query to rebuild the B+-tree index on the 'project_name' column of the 'projects' table to reclaim wasted space and improve performance.",
            "exampleAnswer": "ALTER INDEX idx_project_name REBUILD;"
        },
        {
            "question": "5. Create a composite B+-tree index on the 'start_date' and 'end_date' columns of the 'projects' table to optimize range queries on project durations. Provide the SQL statement to create this index.",
            "answer": "CREATE INDEX idx_project_duration ON projects (start_date, end_date);",
            "exampleQuestion": "5. Create a composite B+-tree index on the 'transaction_date' and 'amount' columns of the 'financial_transactions' table to optimize range queries on transaction dates and amounts. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE INDEX idx_transaction_date_amount ON financial_transactions (transaction_date, amount);"
        },
        {
            "question": "6. Implement prefix compression on the B+-tree index for the 'client_name' column of the 'clients' table to handle variable-length strings efficiently. Provide the SQL statement to create this index with prefix compression.",
            "answer": "CREATE INDEX idx_client_name ON clients (client_name) WITH (PREFIX_COMPRESSION = ON);",
            "exampleQuestion": "6. Implement prefix compression on the B+-tree index for the 'project_name' column of the 'projects' table to handle variable-length strings efficiently. Provide the SQL statement to create this index with prefix compression.",
            "exampleAnswer": "CREATE INDEX idx_project_name ON projects (project_name) WITH (PREFIX_COMPRESSION = ON);"
        },
        {
            "question": "7. Write a SQL query to drop the hash index on the 'employee_id' column of the 'employees' table.",
            "answer": "DROP INDEX idx_employee_id;",
            "exampleQuestion": "7. Write a SQL query to drop the hash index on the 'invoice_id' column of the 'invoices' table.",
            "exampleAnswer": "DROP INDEX idx_invoice_id;"
        },
        {
            "question": "8. Create a clustered index on the 'project_id' column of the 'projects' table to improve the performance of queries that frequently access project records by their IDs. Provide the SQL statement to create this index.",
            "answer": "CREATE CLUSTERED INDEX idx_project_id ON projects (project_id);",
            "exampleQuestion": "8. Create a clustered index on the 'client_id' column of the 'clients' table to improve the performance of queries that frequently access client records by their IDs. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE CLUSTERED INDEX idx_client_id ON clients (client_id);"
        },
        {
            "question": "9. Write a SQL query to analyze the execution plan of a query that retrieves all projects with a specific status from the 'projects' table. Use the EXPLAIN command.",
            "answer": "EXPLAIN SELECT * FROM projects WHERE project_status = 'Active';",
            "exampleQuestion": "9. Write a SQL query to analyze the execution plan of a query that retrieves all employees with a specific role from the 'employees' table. Use the EXPLAIN command.",
            "exampleAnswer": "EXPLAIN SELECT * FROM employees WHERE employee_role = 'Developer';"
        },
        {
            "question": "10. Implement a spatial index on the 'location' column of the 'projects' table to support efficient spatial queries. Provide the SQL statement to create this index.",
            "answer": "CREATE SPATIAL INDEX idx_location ON projects (location);",
            "exampleQuestion": "10. Implement a spatial index on the 'office_location' column of the 'employees' table to support efficient spatial queries. Provide the SQL statement to create this index.",
            "exampleAnswer": "CREATE SPATIAL INDEX idx_office_location ON employees (office_location);"
        }
    ]
}