Cityscape
=========

Handling disparate user interests in an upvoting system
-------------------------------------------------------

Cityscape is a prototype for serving the best results for diverse user interests in an upvoting system. It uses Flickr's photo base for high-quality pictures and implements a unique upvoting system. It is tailored to city architecture in order to reduce data storage needs, but is built to handle Flickr as a whole.

Upvoting is great at offering user curation to interest-based communities. With a simple upvoting system, results from searches are ordered based on total upvotes, regardless of the context in which those votes were cast. However, users have diverse sub-interests within these communities that inform their searching and voting habits, which in turn affect site-wide rankings. These sub-interests can interfere with each other in numerous ways, and communities often fracture as a result.

###Issues


1.  Niche interest erasure
    The NYC skyline would be a common search and users will vote for photos that best match that query. A much less common search would be for the Chrysler Building, but could return some of the same photos as the NYC skyline search. Why should highly trafficked and voted NYC skyline photos that aren't focused on the Chrysler Building outrank less popular photos that are more relevant?

2.  Opposite results caused by different interests
    A photo of 17th-century Parisian architecture would be returned by searches for Paris and 17-century architecture. Users' decisions to upvote or not could easily hinge on which search query they used, as votes are cast in the context of that interest. The photo could live up to the expectations of one interest but not the other.

###Solution

Cityscape implements search-weighted rankings by associating any active search terms with votes when they are cast. Those votes always count more for any of those queries than any vote without that association. As a result, rankings are calculated per search, and subcommunities are essentially created within a single upvoting system without fracturing the underlying community. This allows large user bases to maintain specialization for niche interests, avoid competition between major interests, and provide users with access to all of their interests in a single portal.