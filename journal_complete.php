<?php require_once 'includes/initialize.php'; ?>
<?php require_once 'includes/session.php'; ?>
<!DOCTYPE html>
<html>
  <head>
    <!-- What it tries to add as homepage app name -->
  	<title>Journal Entry</title>
    <!-- CSS -->
	<link rel="stylesheet" href="css/normalize.css">
	<!-- Add2Home Styling -->
	<link rel="stylesheet" href="css/css-add2home.css">
	<link rel="stylesheet" href="css/main.css">
  	<!-- META -->
  	<meta charset="utf-8">
  	<!-- HACKS -->
  	<!-- Prevent text size change on orientation change -->
  	<style>
  		html {
  			-webkit-text-size-adjust: 100%;
  		}
  	</style>

  </head>
  <body>

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

<div class="entry_wrap">
  <div class="info_wrap">
    <h1 class="headliner"><?php echo $row['headliner']; ?></h1>
    <h2 class="opener"><?php echo $row['supporting_act']; ?></h2>
    <h3 class="event"><?php echo $row['concert_time']; ?></h3>
    <h4 class="location"><?php echo $row['venue']; ?></h4>
    <h4 class="date"><?php echo $row['concert_date']; ?></h4>
  </div>

<!--
<div id="fixed_edit">
  <p>want to edit this entry? </p>

</div>
-->

<div id="text_wrap">
  <p><?php echo $row['entry']; ?></p>
</div>
    
    <form action="edit_concert.php" method="post" id="edit_entry">
    <p>
      <input type="text" name="headliner" id="headliner" value="<?php echo $concert_info['headliner']; ?>" class="uneeded">
      </p>   
    <p>
      <input type="date" name="concert_date" id="concert_date" value="<?php echo $concert_info['concert_date']; ?>" class="uneeded">
    </p>                 

    <button type="submit" name="submit">
        <div id="edit_wrap">
            <p>edit this entry</p>
        </div>
        </button>
    </form>
                            
              <?php   
         }
    }
        mysqli_free_result($result);


?>
</div>
  </body>
</html>
