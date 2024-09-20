<?php

return [

    'paths' => ['/api/recentSearchesOfUser/*', '/api/addRecentSearch', '/api/editRecentSearch', '/api/searchResults/*/*', '/api/deleteRecentSearch', '/api/clearAllRecentSearches/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:8019'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];