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
import az.developia.fooderos.sent6group.model.Food;
import az.developia.fooderos.sent6group.repository.FoodRepository;

@RestController
@RequestMapping("/api/foods/")
@CrossOrigin(origins="http://127.0.0.1:5500")
public class FoodRestController {

	@Autowired
	private FoodRepository foodRepo;
	
	@GetMapping({"", "/"})
	public ResponseEntity<List<Food>> getAllFoods(){
		return new ResponseEntity<List<Food>>(foodRepo.findAll(),HttpStatus.OK);
	}
	
	@GetMapping("/find/{id}")
	public ResponseEntity<Food> getFoodById(@PathVariable Long id){
		Optional<Food> resultFood = foodRepo.findById(id);
		if(resultFood.isEmpty()) {
			throw new FoodNotFoundException("Food is not found");
		}
		return new ResponseEntity<Food>(resultFood.get(), HttpStatus.OK);
	}
	
	@PostMapping("/")
	public ResponseEntity<Food> postFood(@RequestBody Food food){
		food.setId((long) (0));
		foodRepo.save(food);
		return new ResponseEntity<Food>(food,HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Food> deleteFood(@PathVariable Long id){
		Optional<Food> resultFood = foodRepo.findById(id);
		if(resultFood.isEmpty()) {
			throw new FoodNotFoundException("food is not found");
		}
		
		foodRepo.delete(resultFood.get());
		
		return new ResponseEntity<Food>(resultFood.get(), HttpStatus.ACCEPTED);
				
	}
}
