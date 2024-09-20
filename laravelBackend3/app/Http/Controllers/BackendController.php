<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RecentSearch;
use App\Models\MyAppUser;
use Carbon\Carbon;
use App\Models\UserFollowings;

class BackendController extends Controller {


    public function getRecentSearchesOfUser(string $username) {
        $oneWeekAgo = Carbon::now()->subWeek();
        RecentSearch::where('date_time_of_search', '<=', $oneWeekAgo)
        ->delete();

        $recentSearchesOfUser = RecentSearch::where('username', $username)
        ->orderBy('date_time_of_search', 'desc')
        ->get();
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

    public function getAllUsers() {
        return response()->json(MyAppUser::all(), 200);
    }

    public function getSearchResults(Request $request, string $username, string $searchText) {
        $output = [];

        $userBlockings = $request->input('userBlockings');
        $usersFollowed = $request->input('usersFollowed'); //list of usernames followed by $username
        $recentUserSearchesByUser = $request->input('recentUserSearches');
        $recentUserSearchMappings = []; //key: username, value: position in $recentUserSearchesByUser list; the lower the position the more recent
        for ($i = 0; $i < count($recentUserSearchesByUser); $i++) {
            $recentUserSearchMappings[$recentUserSearchesByUser[$i]] = $i;
        }


        $recentTopicSearchesByUser = $request->input('recentTopicSearches');
        $recentTopicSearchMappings = []; //key: topic, value: position in $recentTopicSearchesByUser list; the lower the position, the more recent
        for ($i = 0; $i < count($recentTopicSearchesByUser); $i++) {
            $recentTopicSearchMappings[$recentTopicSearchesByUser[$i]] = $i;
        }

        $exactUserMatch = null;
        $recentlySearchedMatches = [];
        $usersFollowedMatches = [];
        $usersWithMutualFollowersMatches = [];
        $top5MostSearchedUserMatches = [];
        $mutualFollowerMappings = []; //key: username, value: number of mutual followers with $username

        $recentSearchesAndTheirCounts = RecentSearch::select('type_of_search', 'search')
        ->groupBy('type_of_search', 'search')
        ->orderBy('count', 'DESC')
        ->get();
        $searchPopularityMappings = ['user'=> [], 'topic'=>[]];
        $popularTopics = [];

        for($i=0; $i<count($recentSearchesAndTheirCounts); $i++) {
            if(str_starts_with($recentSearchesAndTheirCounts[$i]->search, searchText) && $recentSearchesAndTheirCounts[$i]->type_of_search=='topic') {
                $popularTopics[] = (object) [
                    'search' => $recentSearchesAndTheirCounts[$i]->search,
                    'type_of_search' => 'topic',
                    'search_fullname' => null,
                    'search_isVerified' => null
                ];
            }
            else {
                $searchPopularityMappings[$recentSearchesAndTheirCounts[$i]->type_of_search][$recentSearchesAndTheirCounts[$i]->search] = $i+1;
            }
        }

        $potentialResults = MyAppUser::where('username', 'like', $searchText . '%')
        ->whereNotIn('username', $userBlockings)
        ->get(['username', 'fullName', 'isVerified']);

        foreach($potentialResults as $potentialResult) {
            $userToBeInserted = (object) [
                'search' => $potentialResult->username,
                'type_of_search' => 'user',
                'search_fullname' => $potentialResult->fullName,
                'search_isVerified' => $potentialResult->isVerified,
            ];
            if($potentialResult->username==$username) {
                $exactUserMatch = $userToBeInserted;
            }
            else if(isset($recentUserSearchMappings[$potentialResult->username])) {
                $hasUserBeenPlacedYet = false;
                for ($i = 0; $i < count($recentlySearchedMatches); $i++) {
                    if($recentUserSearchMappings[$recentlySearchedMatches[$i]->search] > $recentUserSearchMappings[$potentialResult->username]) {
                        array_splice($recentlySearchedMatches, $i, 0, $userToBeInserted );
                        $hasUserBeenPlacedYet = true;
                        break;
                    }
                }
                if(!$hasUserBeenPlacedYet) {
                    $recentlySearchedMatches[] = $userToBeInserted;
                }
            }
            else if(in_array($potentialResult->username, $usersFollowed)) {
                $usersFollowedMatches[] = $userToBeInserted;
            }
            else {
                $numberOfMutualFollowers = getNumberOfMutualFollowers($usersFollowed, $potentialResult->username);
                if($numberOfMutualFollowers>0) {
                    $mutualFollowerMappings[$potentialResult->username] = $numberOfMutualFollowers;
                    $hasUserBeenPlacedYet = false;
                    for ($i = 0; $i < count($usersWithMutualFollowersMatches); $i++) {
                        if($numberOfMutualFollowers > $mutualFollowerMappings[$usersWithMutualFollowersMatches[i]->search]) {
                            array_splice($usersWithMutualFollowersMatches, $i, 0, $userToBeInserted);
                            $hasUserBeenPlacedYet = true;
                            break;
                        }
                    }
                    if(!$hasUserBeenPlacedYet) {
                        $usersWithMutualFollowersMatches[] = $userToBeInserted;
                    }
                }
                else if (isset($searchPopularityMappings['user'][$potentialResult->username])) {
                    $hasUserBeenPlacedYet = false;
                    for ($i = 0; $i < count($top5MostSearchedUserMatches); $i++) {
                        if($searchPopularityMappings['user'][$potentialResult->username] < $searchPopularityMappings['user'][$top5MostSearchedUserMatches[$i]->search]) {
                            array_splice($top5MostSearchedUserMatches, $i, 0, $userToBeInserted);
                            $hasUserBeenPlacedYet = true;
                            if(count($top5MostSearchedUserMatches)==6) {
                                array_splice($top5MostSearchedUserMatches, 5, 1);
                            }
                            break;
                        }
                    }
                    if(!$hasUserBeenPlacedYet && count($top5MostSearchedUserMatches)<5) {
                        $top5MostSearchedUserMatches[] = $userToBeInserted;
                    }
                }
            }
        }


        $exactTopicMatch = (object) [
            'search' => $recentTopicSearchesByUser[$i],
            'type_of_search' => 'topic',
            'search_fullname' => null,
            'search_isVerified' => null,
        ];

        $recentlySearchedTopicMatches = [];
        $recentlySearchedTopicMatchesJustTheTopics = [];

        for($i=0; $i<count($recentTopicSearchesByUser); $i++) {
            $topicToBeInserted = (object) [
                'search' => $recentTopicSearchesByUser[$i],
                'type_of_search' => 'topic',
                'search_fullname' => null,
                'search_isVerified' => null,
            ];

            if($recentTopicSearchesByUser[$i]!==searchText && str_starts_with($recentTopicSearchesByUser[$i], searchText)) {
                $recentlySearchedTopicMatches[] = $topicToBeInserted;
                $recentlySearchedTopicMatchesJustTheTopics[] = $recentTopicSearchesByUser[$i];
            }
        }


        $popularTopics = array_filter($popularTopics, function($popularTopic) {
            if($popularTopic->search==searchText || in_array($popularTopic, $recentlySearchedTopicMatchesJustTheTopics)) {
                return false;
            }
            return true;
        });


        if (!is_null($exactUserMatch)) {
            $output = [$exactUserMatch, ...$recentlySearchedMatches, ...$usersFollowedMatches, ...$usersWithMutualFollowersMatches, ...$top5MostSearchedUserMatches, $exactTopicMatch, ...$recentlySearchedTopicMatches, ...$popularTopics];
        }
        else {
            $output = [...$recentlySearchedMatches, ...$usersFollowedMatches, ...$usersWithMutualFollowersMatches, ...$top5MostSearchedUserMatches, $exactTopicMatch, ...$recentlySearchedTopicMatches, ...$popularTopics];
        }

        return response()->json($output, 200);
    }


    // Gets number of followers that $username2 has that $username1 follows
    private function getNumberOfMutualFollowers(array $usersFollowedByUsername1, string $username2) {
        return UserFollowings::where('followee', $username2)
            ->whereIn('follower', $usersFollowedByUsername1)
            ->count();
    }


    public function deleteRecentSearch(Request $request) {
        $oneWeekAgo = Carbon::now()->subWeek();
        RecentSearch::where('date_time_of_search', '<=', $oneWeekAgo)
        ->delete();
        
        $recentSearchesOfUser = RecentSearch::where('username', $request->input('username'))
        ->where('type_of_search', $request->input('type_of_search'))
        ->where('search', $request->input('search'))
        ->delete();
        
        return response()->json(['output' => 'successfully deleted!'], 201);
    }

}