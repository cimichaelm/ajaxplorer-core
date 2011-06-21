/**
 * @package info.ajaxplorer.plugins
 * 
 * Copyright 2007-2010 Charles du Jeu
 * This file is part of AjaXplorer.
 * The latest code can be found at http://www.ajaxplorer.info/
 * 
 * This program is published under the LGPL Gnu Lesser General Public License.
 * You should have received a copy of the license along with AjaXplorer.
 * 
 * The main conditions are as follow : 
 * You must conspicuously and appropriately publish on each copy distributed 
 * an appropriate copyright notice and disclaimer of warranty and keep intact 
 * all the notices that refer to this License and to the absence of any warranty; 
 * and give any other recipients of the Program a copy of the GNU Lesser General 
 * Public License along with the Program. 
 * 
 * If you modify your copy or copies of the library or any portion of it, you may 
 * distribute the resulting library provided you do so under the GNU Lesser 
 * General Public License. However, programs that link to the library may be 
 * licensed under terms of your choice, so long as the library itself can be changed. 
 * Any translation of the GNU Lesser General Public License must be accompanied by the 
 * GNU Lesser General Public License.
 * 
 * If you copy or distribute the program, you must accompany it with the complete 
 * corresponding machine-readable source code or with a written offer, valid for at 
 * least three years, to furnish the complete corresponding machine-readable source code. 
 * 
 * Any of the above conditions can be waived if you get permission from the copyright holder.
 * AjaXplorer is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * 
 * Description : LIGHT GUI FOR BOOKMARKLET
 */
window.logAjxpEven = false;
function logAjxpBmAction(text){
	window.logAjxpEven = !window.logAjxpEven;
	$('actions_log').insert('<div style="border-bottom:1px solid #676965;padding:5px;color:#333;background-color:#'+(window.logAjxpEven?'eee':'fff')+'">' + text + '<div>');
}
window.ajxpActionRegisterd = false;
document.observe("ajaxplorer:gui_loaded", function(){
	document.observe("ajaxplorer:user_logged", function(){
		if(ajaxplorer.user && !window.ajxpActionRegistered){
			window.ajxpActionRegistered = true;
			var params = document.location.href.toQueryParams();
			logAjxpBmAction('Handling download link '+params['dl_later']);
			var conn = new Connexion();
			var filename = (new Date().getTime()) +".download";
			conn.setParameters({
				action:'mkfile',
				tmp_repository_id:params['tmp_repository_id'],
				dir:params['folder'] || '/',
				filename:filename,
				content:params['dl_later']
			});
			logAjxpBmAction('Creating file ' + filename + ' pointing to ' + params['dl_later']);
			conn.sendSync();

			window.setTimeout(function(){
				conn.setMethod('GET');
				conn.setParameters({
					action:'external_download',
					tmp_repository_id:params['tmp_repository_id'],
					dlfile:(params['folder']?params['folder']+'/':'/')+filename,
					delete_dlfile:'true',
					dir:params['folder'] || '/'
				});
				logAjxpBmAction('Triggering download in background. This window will close automatically.');
				conn.sendSync();					
			}, 0);			
		}
	});	
});