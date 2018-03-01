<?php require_once 'includes/initialize.php'; ?>
<?php require_once 'includes/session.php'; ?>
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
    <!-- CSS -->
	<link rel="stylesheet" href="css/normalize.css">
	<!-- Add2Home Styling -->
	<link rel="stylesheet" href="css/css-add2home.css">
	<link rel="stylesheet" href="css/main.css">
</head>
<body>
	<!-- Portrait View Start -->
<div class="port_wrap">
    <form action="php/concert_processing.php" method="post">
      <div id="gather">
		 
		 <div id="headliner-input-continer" class="first-container">

          	<input type="text" name="headliner" placeholder="Headliner" id="headliner" class="text-input">
		  </div>
		  
		  <div id="opener-input-container" class="first-container">

          	<input type="text" name="supporting_act"  placeholder="Supporting Act" id="supporting_act" class="text-input">
		  </div>
        
		<div id="venue-input-container" class="second-container">

          <input type="text" name="venue"  placeholder="Venue" id="venue" class="text-input">
        </div>
		  
		<div id="date-input-container" class="third-container">

          <input type="date" name="concert_date" id="concert_date" class="text-input" placeholder="date">
		</div>
     	
        <div id="date-input-container">
          <input type="time" name="concert_time" id="concert_time" class="text-input" placeholder="">
		</div>  
          
<!--
		<div id="photo-input-container">
			<input type="file" name="image" id="photoInput">  
		</div>
-->
		 
		<div id="journal-input-container"  class="container-padding">
       <textarea type="text" name="entry" id="entry" placeholder="What was the best part of the night?" class="textarea"></textarea>
		</div>

      </div>
		<div id="save-entry-container">
			<button type="submit" value="save" name="submit"></button>
		</div>
    </form>
    
        <form action='php/logout_processing.php' method='post'>
    <input type='submit' name='submit' value='Log Out'>
    </form>
    
    <a href="index.php">Cancel</a>
	</div>
</body>
</html>