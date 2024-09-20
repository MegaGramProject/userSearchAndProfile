<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserFollowing extends Model
{
    protected $table = 'userfollowings';

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = null;

}
