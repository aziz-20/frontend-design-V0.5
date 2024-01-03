export default [

    {
        "parents": [
            {
                "name": "Parent 1",
                "groupId": "group-1",
                "children": [
                    {
                        "name": "Child 1",
                        "groupId": "group-1-1",
                        "tests": [
                            {
                                "name": "Permission 8",
                                "testid": "perm-8"
                            },
                            {
                                "name": "Permission 10",
                                "testId": "perm 10"
                            }
                        ]
                    },
                    {
                        "name": "Child 2",
                        "groupId": "group-1-2",
                        "tests": [
                            {
                                "name": "Permission 6",
                                "testid": "perm 3"
                            },
                            {
                                "name": "Permission 7",
                                "permId": "perm-2"
                            }
                        ]
                    }
                ]
            },
            {
                "name": "Parent 3",
                "groupId": "group-3",
                "children": [
                    {
                        "name": "Child 3",
                        "groupId": "group-3-1",
                        "tests": [
                            {
                                "name": "Permission 1",
                                "testid": "perm-1"
                            },
                            {
                                "name": "Permission 2",
                                "testId": "perm-2"
                            }
                        ]
                    }
                ]
            }
        ],
        
    }
]