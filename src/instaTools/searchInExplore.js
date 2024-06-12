import typeText from "../commands/typeText.js";
import { delay } from "../utils/delay.js";
import { tapElementByResourceId } from "../utils/utils.js";

export const searchInExplore = async (deviceId, search) => {
  try {
    // always return to home
    await tapElementByResourceId(deviceId, "com.instagram.android:id/feed_tab");
    await delay(2000);

    // go to explore
    await tapElementByResourceId(
      deviceId,
      "com.instagram.android:id/search_tab"
    );

    // click on search tab
    await delay(1500);
    await tapElementByResourceId(
        deviceId,
        "com.instagram.android:id/action_bar"
    );

    // enter the term
    await delay(2000);
    await typeText(deviceId, search);

  } catch (error) {
    console.log("Error searching In Explore: " + error);
  }
};
