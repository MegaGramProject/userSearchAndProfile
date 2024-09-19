<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecentSearch extends Model
{
    protected $table = 'recent_searches_of_users';

    protected $fillable = [
        'username',
        'date_time_of_search',
        'type_of_search',
        'search',
        'search_fullname',
        'search_isverified'
    ];


    public $timestamps = false;

    public $incrementing = false;

    public function getKeyName()
    {
        return ['username', 'type_of_search', 'search'];
    }

}
