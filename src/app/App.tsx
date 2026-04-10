import { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ContinueWatching } from './components/ContinueWatching';
import { ContentSection } from './components/ContentSection';
import { FilterBar } from './components/FilterBar';
import { DetailModal } from './components/DetailModal';
import { SearchResults } from './components/SearchResults';
import { PlayScreen } from './components/PlayScreen';
import type { ContentItem, WatchProgress } from './types';

// ── Mock Content Data ────────────────────────────────────────────────────────

const MOVIES: ContentItem[] = [
  {
    id: 'mov-1', title: 'Inception', type: 'movie', genre: 'Sci-Fi', year: 2010,
    rating: 8.8, maturityRating: 'PG-13',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80',
    description: 'A skilled thief is offered a chance to have his criminal record erased if he can successfully perform inception: planting an idea into a target\'s subconscious.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    reason: 'Because you watched Interstellar',
    badge: 'Top 10',
  },
  {
    id: 'mov-2', title: 'The Dark Knight', type: 'movie', genre: 'Action', year: 2008,
    rating: 9.0, maturityRating: 'PG-13',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&q=80',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Heath Ledger', role: 'Joker', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
    ],
    reason: 'Critically acclaimed action thriller',
    badge: 'Top 10',
  },
  {
    id: 'mov-3', title: 'Interstellar', type: 'movie', genre: 'Sci-Fi', year: 2014,
    rating: 8.6, maturityRating: 'PG-13',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Anne Hathaway', role: 'Brand', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Top pick in Sci-Fi',
  },
  {
    id: 'mov-4', title: 'Parasite', type: 'movie', genre: 'Thriller', year: 2019,
    rating: 8.6, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&q=80',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    director: 'Bong Joon-ho',
    cast: [
      { name: 'Song Kang-ho', role: 'Ki-taek', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    reason: 'Award-winning thriller',
    badge: 'New',
  },
  {
    id: 'mov-5', title: 'The Shawshank Redemption', type: 'movie', genre: 'Drama', year: 1994,
    rating: 9.3, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    director: 'Frank Darabont',
    cast: [
      { name: 'Tim Robbins', role: 'Andy Dufresne', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Morgan Freeman', role: 'Ellis Boyd', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
    ],
    reason: 'All-time classic drama',
  },
  {
    id: 'mov-6', title: 'Pulp Fiction', type: 'movie', genre: 'Thriller', year: 1994,
    rating: 8.9, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=400&q=80',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    director: 'Quentin Tarantino',
    cast: [
      { name: 'John Travolta', role: 'Vincent Vega', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Samuel L. Jackson', role: 'Jules Winnfield', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    reason: 'Because you like Tarantino films',
  },
  {
    id: 'mov-7', title: 'The Matrix', type: 'movie', genre: 'Sci-Fi', year: 1999,
    rating: 8.7, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    director: 'Wachowski Sisters',
    cast: [
      { name: 'Keanu Reeves', role: 'Neo', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Laurence Fishburne', role: 'Morpheus', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
    ],
    reason: 'Sci-Fi essential',
  },
  {
    id: 'mov-8', title: 'Knives Out', type: 'movie', genre: 'Thriller', year: 2019,
    rating: 7.9, maturityRating: 'PG-13',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
    description: 'A detective investigates the death of a patriarch of an eccentric, combative family.',
    director: 'Rian Johnson',
    cast: [
      { name: 'Daniel Craig', role: 'Benoit Blanc', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Ana de Armas', role: 'Marta Cabrera', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Trending this week',
    badge: 'New',
  },
  {
    id: 'mov-9', title: 'Whiplash', type: 'movie', genre: 'Drama', year: 2014,
    rating: 8.5, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=400&q=80',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student\'s potential.',
    director: 'Damien Chazelle',
    cast: [
      { name: 'Miles Teller', role: 'Andrew Neiman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
      { name: 'J.K. Simmons', role: 'Fletcher', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
    ],
    reason: 'Highly rated drama',
  },
  {
    id: 'mov-10', title: 'The Grand Budapest Hotel', type: 'movie', genre: 'Comedy', year: 2014,
    rating: 8.1, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel\'s glorious past.',
    director: 'Wes Anderson',
    cast: [
      { name: 'Ralph Fiennes', role: 'M. Gustave', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
    ],
    reason: 'Wes Anderson fan favorite',
  },
  {
    id: 'mov-11', title: 'Mad Max: Fury Road', type: 'movie', genre: 'Action', year: 2015,
    rating: 8.1, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&q=80',
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners and a drifter named Max.',
    director: 'George Miller',
    cast: [
      { name: 'Tom Hardy', role: 'Max Rockatansky', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Charlize Theron', role: 'Furiosa', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Action masterpiece',
  },
  {
    id: 'mov-12', title: 'Spirited Away', type: 'movie', genre: 'Comedy', year: 2001,
    rating: 8.6, maturityRating: 'PG',
    thumbnail: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    director: 'Hayao Miyazaki',
    cast: [],
    reason: 'Studio Ghibli classic',
  },
  {
    id: 'mov-13', title: 'Dune', type: 'movie', genre: 'Sci-Fi', year: 2021,
    rating: 8.0, maturityRating: 'PG-13',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset while its heir becomes troubled by visions of a dark future.',
    director: 'Denis Villeneuve',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
      { name: 'Zendaya', role: 'Chani', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Epic sci-fi saga',
    badge: 'New',
  },
  {
    id: 'mov-14', title: 'Everything Everywhere All at Once', type: 'movie', genre: 'Action', year: 2022,
    rating: 7.8, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    description: 'An aging Chinese immigrant is swept up in an insane adventure where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    director: 'Daniel Kwan & Daniel Scheinert',
    cast: [
      { name: 'Michelle Yeoh', role: 'Evelyn Wang', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Oscar Best Picture winner',
    badge: 'New',
  },
  {
    id: 'mov-15', title: 'Oppenheimer', type: 'movie', genre: 'Drama', year: 2023,
    rating: 8.3, maturityRating: 'R',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    director: 'Christopher Nolan',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Emily Blunt', role: 'Kitty Oppenheimer', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    reason: 'Oscar-winning epic',
    badge: 'New',
  },
];

const SERIES: ContentItem[] = [
  {
    id: 'ser-1', title: 'Breaking Bad', type: 'series', genre: 'Thriller', year: 2008,
    rating: 9.5, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    director: 'Vince Gilligan',
    cast: [
      { name: 'Bryan Cranston', role: 'Walter White', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Aaron Paul', role: 'Jesse Pinkman', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Pilot', description: 'Walter White\'s transformation begins.', duration: '58m', thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80' },
          { episodeNumber: 2, title: "Cat's in the Bag", description: 'Walt and Jesse must deal with the aftermath.', duration: '48m', thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80' },
          { episodeNumber: 3, title: "And the Bag's in the River", description: 'Walt faces a moral dilemma.', duration: '48m', thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80' },
        ],
      },
      {
        seasonNumber: 2, episodes: [
          { episodeNumber: 1, title: 'Seven Thirty-Seven', description: 'Walt and Jesse face new dangers.', duration: '47m', thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80' },
          { episodeNumber: 2, title: 'Grilled', description: 'A dangerous confrontation unfolds.', duration: '47m', thumbnail: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80' },
        ],
      },
    ],
    reason: '#1 in Drama this week',
    badge: 'Top 10',
  },
  {
    id: 'ser-2', title: 'Stranger Things', type: 'series', genre: 'Sci-Fi', year: 2016,
    rating: 8.7, maturityRating: 'TV-14',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.',
    director: 'The Duffer Brothers',
    cast: [
      { name: 'Millie Bobby Brown', role: 'Eleven', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
      { name: 'Finn Wolfhard', role: 'Mike Wheeler', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'The Vanishing of Will Byers', description: 'A boy goes missing in Hawkins, Indiana.', duration: '47m', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
          { episodeNumber: 2, title: 'The Weirdo on Maple Street', description: 'Lucas, Mike and Dustin try to talk to the girl.', duration: '55m', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
          { episodeNumber: 3, title: 'Holly, Jolly', description: 'Joyce makes a discovery.', duration: '51m', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=80' },
        ],
      },
    ],
    reason: 'Popular with Sci-Fi fans',
    badge: 'New',
  },
  {
    id: 'ser-3', title: 'The Crown', type: 'series', genre: 'Drama', year: 2016,
    rating: 8.6, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=400&q=80',
    description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the twentieth century.',
    director: 'Peter Morgan',
    cast: [
      { name: 'Claire Foy', role: 'Queen Elizabeth II', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
      { name: 'Matt Smith', role: 'Prince Philip', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Wolferton Splash', description: 'Young Elizabeth marries Philip.', duration: '57m', thumbnail: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=200&q=80' },
          { episodeNumber: 2, title: 'Hyde Park Corner', description: 'The King\'s health deteriorates.', duration: '56m', thumbnail: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=200&q=80' },
        ],
      },
    ],
    reason: 'Award-winning historical drama',
  },
  {
    id: 'ser-4', title: 'Dark', type: 'series', genre: 'Sci-Fi', year: 2017,
    rating: 8.8, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    description: 'A missing child sets off a chain of events revealing the secrets of a small German town, including the double lives of four interconnected families as they search for the truth spanning several generations.',
    director: 'Baran bo Odar',
    cast: [
      { name: 'Louis Hofmann', role: 'Jonas Kahnwald', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Secrets', description: 'In 2019, two children go missing in Winden.', duration: '52m', thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80' },
          { episodeNumber: 2, title: 'Lies', description: 'The Kahnwald family hides a secret.', duration: '52m', thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=200&q=80' },
        ],
      },
    ],
    reason: 'Mind-bending time travel thriller',
  },
  {
    id: 'ser-5', title: 'Succession', type: 'series', genre: 'Drama', year: 2018,
    rating: 8.9, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    description: 'The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their father steps down from the company.',
    director: 'Jesse Armstrong',
    cast: [
      { name: 'Brian Cox', role: 'Logan Roy', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
      { name: 'Jeremy Strong', role: 'Kendall Roy', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Celebration', description: 'Logan Roy\'s 80th birthday celebration.', duration: '60m', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80' },
          { episodeNumber: 2, title: 'Shit Show at the Fuck Factory', description: 'The family deals with a crisis.', duration: '55m', thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80' },
        ],
      },
    ],
    reason: 'Emmy-winning drama series',
    badge: 'Top 10',
  },
  {
    id: 'ser-6', title: 'The Office', type: 'series', genre: 'Comedy', year: 2005,
    rating: 9.0, maturityRating: 'TV-14',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
    director: 'Greg Daniels',
    cast: [
      { name: 'Steve Carell', role: 'Michael Scott', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'John Krasinski', role: 'Jim Halpert', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Pilot', description: 'Introducing Dunder Mifflin Scranton.', duration: '23m', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80' },
          { episodeNumber: 2, title: 'Diversity Day', description: 'Michael hosts a diversity seminar.', duration: '22m', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80' },
          { episodeNumber: 3, title: 'Health Care', description: 'Dwight selects the health care plan.', duration: '22m', thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80' },
        ],
      },
    ],
    reason: 'Beloved workplace comedy',
  },
  {
    id: 'ser-7', title: 'Squid Game', type: 'series', genre: 'Thriller', year: 2021,
    rating: 8.0, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a deadly game awaits them with a survival prize of ₩45.6 billion.',
    director: 'Hwang Dong-hyuk',
    cast: [
      { name: 'Lee Jung-jae', role: 'Seong Gi-hun', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Red Light, Green Light', description: 'Gi-hun is invited to play a series of games.', duration: '60m', thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
          { episodeNumber: 2, title: 'Hell', description: 'Players are given a chance to leave.', duration: '63m', thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
        ],
      },
    ],
    reason: 'Global phenomenon',
    badge: 'Top 10',
  },
  {
    id: 'ser-8', title: 'Ozark', type: 'series', genre: 'Thriller', year: 2017,
    rating: 8.4, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    description: 'A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.',
    director: 'Bill Dubuque',
    cast: [
      { name: 'Jason Bateman', role: 'Marty Byrde', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
      { name: 'Laura Linney', role: 'Wendy Byrde', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Sugarwood', description: 'Marty Byrde moves his family to the Ozarks.', duration: '60m', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&q=80' },
          { episodeNumber: 2, title: 'Blue Cat', description: 'The Byrdes settle into life in Osage Beach.', duration: '56m', thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&q=80' },
        ],
      },
    ],
    reason: 'Gripping crime drama',
  },
  {
    id: 'ser-9', title: 'Narcos', type: 'series', genre: 'Action', year: 2015,
    rating: 8.8, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=400&q=80',
    description: 'A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who plagued the country through the years.',
    director: 'Chris Brancato',
    cast: [
      { name: 'Wagner Moura', role: 'Pablo Escobar', image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'Descenso', description: 'Pablo Escobar rises to power.', duration: '58m', thumbnail: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=200&q=80' },
          { episodeNumber: 2, title: 'The Sword of Simón Bolívar', description: 'Escobar expands his operation.', duration: '52m', thumbnail: 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?w=200&q=80' },
        ],
      },
    ],
    reason: 'Critically acclaimed crime series',
  },
  {
    id: 'ser-10', title: 'The Witcher', type: 'series', genre: 'Action', year: 2019,
    rating: 8.2, maturityRating: 'TV-MA',
    thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&q=80',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    director: 'Lauren Schmidt Hissrich',
    cast: [
      { name: 'Henry Cavill', role: 'Geralt of Rivia', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80' },
      { name: 'Anya Chalotra', role: 'Yennefer', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
    ],
    seasons: [
      {
        seasonNumber: 1, episodes: [
          { episodeNumber: 1, title: 'The End\'s Beginning', description: 'Geralt meets a princess who is cursed.', duration: '61m', thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&q=80' },
          { episodeNumber: 2, title: 'Four Marks', description: 'Yennefer\'s origin story unfolds.', duration: '56m', thumbnail: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&q=80' },
        ],
      },
    ],
    reason: 'Epic fantasy adventure',
    badge: 'New',
  },
];

export const ALL_CONTENT: ContentItem[] = [...MOVIES, ...SERIES];

const CONTINUE_WATCHING = [
  { itemId: 'ser-1', progress: 65, episode: 'S2:E3', season: 2, episodeNum: 3 },
  { itemId: 'mov-3', progress: 42, episode: undefined, season: undefined, episodeNum: undefined },
  { itemId: 'ser-2', progress: 80, episode: 'S1:E3', season: 1, episodeNum: 3 },
  { itemId: 'mov-7', progress: 20, episode: undefined, season: undefined, episodeNum: undefined },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

type SortOption = 'recommended' | 'newest' | 'top-rated';
type Genre = 'All' | 'Action' | 'Sci-Fi' | 'Drama' | 'Thriller' | 'Comedy';

const deduped = (items: ContentItem[]): ContentItem[] => {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  return items.filter(item => {
    const titleKey = item.title.toLowerCase();
    if (seenIds.has(item.id) || seenTitles.has(titleKey)) return false;
    seenIds.add(item.id);
    seenTitles.add(titleKey);
    return true;
  });
};

const filterByGenre = (items: ContentItem[], genre: Genre): ContentItem[] =>
  genre === 'All' ? items : items.filter(c => c.genre === genre);

const sortItems = (items: ContentItem[], sort: SortOption): ContentItem[] => {
  if (sort === 'newest') return [...items].sort((a, b) => b.year - a.year);
  if (sort === 'top-rated') return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return items;
};

const getMoreLikeThis = (item: ContentItem | null): ContentItem[] => {
  if (!item) return [];
  const currentTitle = item.title.toLowerCase();
  return deduped(
    ALL_CONTENT.filter(c =>
      c.id !== item.id &&
      c.title.toLowerCase() !== currentTitle &&
      c.genre === item.genre
    )
  ).slice(0, 9);
};

// ── Component ────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'movies' | 'series' | 'mylist'>('home');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [playingItem, setPlayingItem] = useState<ContentItem | null>(null);
  const [myList, setMyList] = useState<ContentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<Genre>('All');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const isInMyList = (id: string) => myList.some(i => i.id === id);
  const addToList = (item: ContentItem) => {
    if (!isInMyList(item.id)) setMyList(prev => [...prev, item]);
  };
  const removeFromList = (id: string) => setMyList(prev => prev.filter(i => i.id !== id));

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSearchQuery('');
    setSelectedGenre('All');
    setSortOption('recommended');
  };

  // Search across all content
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return deduped(ALL_CONTENT.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.genre.toLowerCase().includes(q) ||
      String(c.year).includes(q) ||
      (c.director?.toLowerCase().includes(q)) ||
      c.cast?.some(m => m.name.toLowerCase().includes(q))
    ));
  }, [searchQuery]);

  // Home sections — each section excludes items already shown in a prior section
  const trendingNow = useMemo(() =>
    deduped(ALL_CONTENT.filter(c => c.badge === 'Top 10' || c.badge === 'New')).slice(0, 12),
  []);

  const recommendedForYou = useMemo(() => {
    const usedIds = new Set([
      ALL_CONTENT[0].id,
      ...trendingNow.map(c => c.id),
    ]);
    return deduped(
      sortItems(filterByGenre(ALL_CONTENT, selectedGenre), sortOption)
        .filter(c => !usedIds.has(c.id))
    ).slice(0, 12);
  }, [selectedGenre, sortOption, trendingNow]);

  const topRated = useMemo(() => {
    const usedIds = new Set([
      ALL_CONTENT[0].id,
      ...trendingNow.map(c => c.id),
      ...recommendedForYou.map(c => c.id),
    ]);
    return deduped(
      sortItems(ALL_CONTENT.filter(c => (c.rating || 0) >= 8.5), 'top-rated')
        .filter(c => !usedIds.has(c.id))
    ).slice(0, 12);
  }, [trendingNow, recommendedForYou]);

  // Tab-specific lists
  const moviesFiltered = useMemo(() =>
    deduped(sortItems(filterByGenre(MOVIES, selectedGenre), sortOption)),
  [selectedGenre, sortOption]);

  const seriesFiltered = useMemo(() =>
    deduped(sortItems(filterByGenre(SERIES, selectedGenre), sortOption)),
  [selectedGenre, sortOption]);

  const featuredItem = ALL_CONTENT[0];
  const continueWatchingItems: WatchProgress[] = CONTINUE_WATCHING;

  const commonProps = {
    onItemClick: setSelectedItem,
    onAddToList: addToList,
    onRemoveFromList: removeFromList,
    isInMyList,
    onPlayClick: setPlayingItem,
    autoplayEnabled,
    viewMode,
  };

  const showSearch = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--bg-primary)' }}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded focus:font-bold"
        style={{ background: 'var(--accent)', color: '#fff' }}
      >
        Skip to main content
      </a>

      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        autoplayEnabled={autoplayEnabled}
        onAutoplayToggle={() => setAutoplayEnabled(p => !p)}
      />

      <main id="main-content" tabIndex={-1}>
        {showSearch ? (
          <SearchResults results={searchResults} query={searchQuery} {...commonProps} />
        ) : (
          <>
            {activeTab === 'home' && (
              <>
                <Hero
                  item={featuredItem}
                  onPlay={() => setPlayingItem(featuredItem)}
                  onMoreInfo={() => setSelectedItem(featuredItem)}
                  autoplayEnabled={autoplayEnabled}
                  onAddToList={addToList}
                  onRemoveFromList={removeFromList}
                  isInMyList={isInMyList}
                />
                <div className="px-4 md:px-8 pb-12 space-y-10 pt-8" style={{ background: 'var(--bg-primary)' }}>
                  <FilterBar
                    selectedGenre={selectedGenre}
                    onGenreChange={g => setSelectedGenre(g as Genre)}
                    sortOption={sortOption}
                    onSortChange={s => setSortOption(s as SortOption)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    resultCount={recommendedForYou.length}
                  />
                  <ContinueWatching
                    items={continueWatchingItems}
                    allContent={ALL_CONTENT}
                    onItemClick={setSelectedItem}
                    onPlayClick={setPlayingItem}
                  />
                  <ContentSection title="Trending Now" items={trendingNow} {...commonProps} />
                  <ContentSection title="Recommended For You" items={recommendedForYou} {...commonProps} viewMode={viewMode} />
                  <ContentSection title="Top Rated" items={topRated} {...commonProps} />
                </div>
              </>
            )}

            {activeTab === 'movies' && (
              <div className="px-4 md:px-8 py-8 space-y-6" style={{ paddingTop: '5rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Movies</h1>
                <FilterBar
                  selectedGenre={selectedGenre}
                  onGenreChange={g => setSelectedGenre(g as Genre)}
                  sortOption={sortOption}
                  onSortChange={s => setSortOption(s as SortOption)}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  resultCount={moviesFiltered.length}
                />
                <ContentSection title="" items={moviesFiltered} {...commonProps} viewMode={viewMode} />
              </div>
            )}

            {activeTab === 'series' && (
              <div className="px-4 md:px-8 py-8 space-y-6" style={{ paddingTop: '5rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Series</h1>
                <FilterBar
                  selectedGenre={selectedGenre}
                  onGenreChange={g => setSelectedGenre(g as Genre)}
                  sortOption={sortOption}
                  onSortChange={s => setSortOption(s as SortOption)}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  resultCount={seriesFiltered.length}
                />
                <ContentSection title="" items={seriesFiltered} {...commonProps} viewMode={viewMode} />
              </div>
            )}

            {activeTab === 'mylist' && (
              <div className="px-4 md:px-8 py-8 space-y-6" style={{ paddingTop: '5rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My List</h1>
                {myList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'var(--text-muted)' }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <p className="text-lg font-medium">Your list is empty</p>
                    <p className="text-sm">Browse content and click + to add titles here</p>
                  </div>
                ) : (
                  <ContentSection title="" items={myList} {...commonProps} viewMode={viewMode} />
                )}
              </div>
            )}
          </>
        )}
      </main>

      <DetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAddToList={addToList}
        onRemoveFromList={removeFromList}
        isInMyList={isInMyList}
        moreLikeThis={getMoreLikeThis(selectedItem)}
        onItemClick={setSelectedItem}
        onPlayClick={setPlayingItem}
        autoplayEnabled={autoplayEnabled}
      />

      {playingItem && (
        <PlayScreen
          item={playingItem}
          onClose={() => setPlayingItem(null)}
        />
      )}
    </div>
  );
}
