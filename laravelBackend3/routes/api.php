<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BackendController;

Route::get('/recentSearchesOfUser/{username}', [BackendController::class, 'getRecentSearchesOfUser']);
Route::post('/addRecentSearch', [BackendController::class, 'addRecentSearch']);
Route::patch('/editRecentSearch', [BackendController::class, 'editRecentSearch']);
Route::post('/searchResults/{username}/{searchText}', [BackendController::class, 'getSearchResults']);
Route::delete('/deleteRecentSearch', [BackendController::class, 'deleteRecentSearch']);
Route::delete('/clearAllRecentSearches/{username}', [BackendController::class, 'clearAllRecentSearchesOfUser']);