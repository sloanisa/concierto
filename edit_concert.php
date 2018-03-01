
<?php require_once 'includes/initialize.php'; ?>
<?php require_once 'includes/session.php'; ?>
<!DOCTYPE html>
<html lang="en" >
<head>
  <title>Add Concert</title>
	<!-- CSS -->
  <!-- META -->
  <meta charset="utf-8">
  
</head>
<body>
	<!-- Portrait View Start -->
<div class="port_wrap">

<?php

    if (isset($_POST['submit'])) {
    // form was submitted
    $concert_date = $_POST['concert_date'];
    $headliner = $_POST['headliner'];

    $user_id = $_SESSION['user'];

     $query = "SELECT * FROM concert_info WHERE concert_date = '{$concert_date}' AND headliner = '{$headliner}' AND user_id = '{$user_id}' ";

     $result = mysqli_query($connection, $query);

     if (!$result){
         die('Database query failed.');
     }

         while ($row = mysqli_fetch_assoc($result)) {

             ?>

    <form action="php/edit_processing.php" method="post">
      <div id="gather">

          <div id="headliner-input-continer" class="first-container">
			 
          	<input type="text" name="headliner" value="<?php echo $row['headliner']; ?>" id="headliner" class="text-input">
		  </div>

		  <div id="opener-input-container" class="first-container">
			  
          	<input type="text" name="supporting_act"  value="<?php echo $row['supporting_act']; ?>" id="supporting_act" class="text-input">
		  </div>

		<div id="venue-input-container" class="second-container">
			
          <input type="text" name="venue"  value="<?php echo $row['venue']; ?>" id="venue" class="text-input">
        </div>

		<div id="date-input-container" class="third-container">
			
          <input type="date" name="concert_date" id="concert_date" class="text-input" value="<?php echo $row['concert_date']; ?>">
		</div>

        <div id="date-input-container">
			
          <input type="time" name="concert_time" id="concert_time" class="text-input" value="<?php echo $row['concert_time']; ?>">
		</div>

		<div id="journal-input-container"  class="container-padding">
			
       <textarea type="text" name="entry" id="entry" value="<?php echo $row['entry']; ?>" class="textarea"></textarea>
		</div>

      </div>

		<div id="save-entry-container">
			<button type="submit" name="submit"></button>
		</div>

    </form>
    <form action="php/delete_processing.php" method="post">
        <input type="date" name="concert_date" id="concert_date" value="<?php echo $row['concert_date']; ?>" class="uneeded">


          <input type="text" name="headliner" id="headliner" value="<?php echo $row['headliner']; ?>" class="uneeded">
    <input id="delete_me"type="submit" name="submit" value="delete">
    </form>
    <a href="index.php">Cancel</a>
          <?php
         }
    }
        mysqli_free_result($result);


?>
    </div>

</body>
</html>
