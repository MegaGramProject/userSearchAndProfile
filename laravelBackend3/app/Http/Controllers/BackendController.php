<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RecentSearch;
use Carbon\Carbon;

class BackendController extends Controller {


    public function getRecentSearchesOfUser(Request $request, String $username) {
        $oneWeekAgo = Carbon::now()->subWeek();
        RecentSearch::where('date_time_of_search', '<=', $oneWeekAgo)
        ->delete();
        
        $recentSearchesOfUser = RecentSearch::where('username', $username)->get();
        return response()->json($recentSearchesOfUser, 200);
    }

    public function addRecentSearch(Request $request) {
        $oneWeekAgo = Carbon::now()->subWeek();
        RecentSearch::where('date_time_of_search', '<=', $oneWeekAgo)
        ->delete();
        
        $recentSearchesOfUser = RecentSearch::where('username', $request->input('username'))
        ->orderBy('date_time_of_search', 'asc')
        ->get();
        
        if ($recentSearchesOfUser->count() == 10) {
            $oldestRecentSearch = $recentSearchesOfUser->first();
            $oldestRecentSearch->delete();
        }

        $newlyAddedRecentSearch = RecentSearch::create($request->all());
        return response()->json($newlyAddedRecentSearch, 201);
    }

    public function editRecentSearch(Request $request) {
        $oneWeekAgo = Carbon::now()->subWeek();
        RecentSearch::where('date_time_of_search', '<=', $oneWeekAgo)
        ->delete();

        $username = $request->input('username');
        $type_of_search = $request->input('type_of_search');
        $search = $request->input('search');
        $date_time_of_search = $request->input('date_time_of_search');

        $numberOfRowsAffected = RecentSearch::where('username', $username)
        ->where('type_of_search', $type_of_search)
        ->where('search', $search)
        ->update(['date_time_of_search' => $date_time_of_search]);


        if ($numberOfRowsAffected==1) {
            return response()->json(['output' => 'successfully edited!'], 200);
        } else {
            return response()->json(['output' => 'recent search not found'], 404);
        }
        
    }

    public function getSearchResults(String $username, String $searchText) {
        return response()->json('getSearchResults', 200);
    }
}