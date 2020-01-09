//rs.initiate();
//rs.add("172.17.0.2:27017");
//rs.add("172.17.0.3:27017");
//rs.add("172.17.0.4:27017");
//---------------------

config = {
    _id: "myapp",
    members: [
        {_id:0, host: "mongo1:27017"},
        {_id:1, host: "mongo2:27017"},
        {_id:2, host: "mongo3:27017"},
    ]
};

rs.initiate(config);
rs.conf();