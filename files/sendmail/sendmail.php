<?php
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'phpmailer/src/Exception.php';
	require 'phpmailer/src/PHPMailer.php';
	require 'phpmailer/src/SMTP.php';

	$mail = new PHPMailer(true);
	$mail->CharSet = 'UTF-8';
	$mail->setLanguage('ru', 'phpmailer/language/');
	$mail->IsHTML(true);

	$mail->isSMTP();
   $mail->Host = 'smtp.mail.ru';
   $mail->SMTPAuth = true;
   $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
   $mail->Port = 465;
   $mail->Username = 'nik.asflasdf@mail.ru';
   $mail->Password = 'uqWFh3eHVtkrpmn42SCu';


	//От кого письмо
	$mail->setFrom('nik.asflasdf@mail.ru', 'space travel'); // Указать нужный E-mail
	//Кому отправить
	$mail->addAddress('cherniavski7@gmail.com'); // Указать нужный E-mail
	//Тема письма
	$mail->Subject = 'Тестовое задание';

//Рука
$hand = "Правая";
if($_POST['hand'] == "left"){
   $hand = "Левая";
}

//Тело письма
$body = '<h1>Встречайте супер письмо!</h1>';

if(trim(!empty($_POST['name']))){
   $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
}
if(trim(!empty($_POST['email']))){
   $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
}
if(trim(!empty($_POST['hand']))){
   $body.='<p><strong>Рука:</strong> '.$hand.'</p>';
}
if(trim(!empty($_POST['age']))){
   $body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
}

if(trim(!empty($_POST['message']))){
   $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
}

//Прикрепить файл
if (!empty($_FILES['image']['tmp_name'])) {
   //путь загрузки файла
   $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
   //грузим файл
   if (copy($_FILES['image']['tmp_name'], $filePath)){
      $fileAttach = $filePath;
      $body.='<p><strong>Фото в приложении</strong>';
      $mail->addAttachment($fileAttach);
   }
}

$mail->Body = $body;

//Отправляем
if (!$mail->send()) {
   $message = 'Ошибка';
} else {
   $message = 'Данные отправлены!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);
?>