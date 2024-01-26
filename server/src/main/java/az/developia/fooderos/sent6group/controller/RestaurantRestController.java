package az.developia.fooderos.sent6group.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import az.developia.fooderos.sent6group.exception.FoodNotFoundException;
import az.developia.fooderos.sent6group.model.Restaurant;
import az.developia.fooderos.sent6group.repository.RestaurantRepository;

@RestController
@RequestMapping("/api/restaurants/")
@CrossOrigin(origins="http://127.0.0.1:5500")
public class RestaurantRestController {

	@Autowired
	private RestaurantRepository restaurantRepo;
	
	@GetMapping({"", "/"})
	public ResponseEntity<List<Restaurant>> getAllRestaurants(){
		return new ResponseEntity<List<Restaurant>>(restaurantRepo.findAll(),HttpStatus.OK);
	}
	
	@PostMapping("/")
	public ResponseEntity<Restaurant> postRestaurant(@RequestBody Restaurant restaurant){
		restaurant.setId((long) (0));
		restaurantRepo.save(restaurant);
		return new ResponseEntity<Restaurant>(restaurant,HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Restaurant> deleteRestaurant(@PathVariable Long id){
		Optional<Restaurant> resultRestaurant = restaurantRepo.findById(id);
		if(resultRestaurant.isEmpty()) {
			throw new FoodNotFoundException("food is not found");
		}
		
		restaurantRepo.delete(resultRestaurant.get());
		
		return new ResponseEntity<Restaurant>(resultRestaurant.get(), HttpStatus.ACCEPTED);
				
	}
}
