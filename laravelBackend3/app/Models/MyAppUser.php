<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MyAppUser extends Model
{
    protected $connection = 'mysql_connection';
    
    protected $table = 'myapp_user';

    public $timestamps = false;

    public $primaryKey = 'id';

    public $incrementing = true;
}
